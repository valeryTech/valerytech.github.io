#!/usr/bin/env python3
"""Generate and verify enterprise infrastructure inventories and credential catalogs."""

import argparse
import hashlib
import ipaddress
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
ENVIRONMENTS = ("dev", "test", "stage", "prod", "dr")
CLOUDS = {
    "aws": {"regions": ["us-east-1", "us-west-2"], "cluster": "EKS", "hub": "Transit Gateway"},
    "azure": {"regions": ["eastus2", "westus3"], "cluster": "AKS", "hub": "Virtual WAN"},
    "gcp": {"regions": ["us-central1", "us-east1"], "cluster": "GKE", "hub": "Cloud Router"},
}
DATA_SERVICES = {
    "aws": [
        ("aurora-postgresql", "database", 5432), ("aurora-mysql", "database", 3306),
        ("dynamodb", "database", 443), ("redis", "cache", 6379),
        ("kafka", "messaging", 9093), ("opensearch", "search", 9200),
        ("s3", "object-storage", 443), ("redshift", "warehouse", 5439),
        ("mongodb", "database", 27017), ("rabbitmq", "messaging", 5671),
    ],
    "azure": [
        ("sqlserver", "database", 1433), ("postgresql", "database", 5432),
        ("cosmosdb", "database", 443), ("redis", "cache", 6380),
        ("eventhubs", "messaging", 9093), ("blob", "object-storage", 443),
        ("adls", "object-storage", 443), ("synapse", "warehouse", 1433),
        ("oracle", "database", 1521), ("nats", "messaging", 4222),
    ],
    "gcp": [
        ("postgresql", "database", 5432), ("mysql", "database", 3306),
        ("spanner", "database", 443), ("bigtable", "database", 443),
        ("redis", "cache", 6379), ("pubsub", "messaging", 443),
        ("bigquery", "warehouse", 443), ("gcs", "object-storage", 443),
        ("clickhouse", "warehouse", 8443), ("cassandra", "database", 9042),
    ],
}
# Service name, cloud, primary datastore, responsible team.
SERVICES = [
    ("api-gateway", "aws", "redis", "platform"),
    ("identity-service", "azure", "postgresql", "identity"),
    ("customer-service", "gcp", "spanner", "customer"),
    ("order-service", "aws", "aurora-postgresql", "commerce"),
    ("payment-service", "aws", "aurora-mysql", "payments"),
    ("billing-service", "azure", "sqlserver", "finance"),
    ("inventory-service", "gcp", "mysql", "supply-chain"),
    ("search-service", "aws", "opensearch", "discovery"),
    ("notification-service", "azure", "eventhubs", "engagement"),
    ("recommendation-service", "gcp", "bigtable", "ml-platform"),
    ("analytics-service", "gcp", "bigquery", "data-platform"),
    ("fraud-service", "aws", "redshift", "risk"),
    ("workflow-service", "azure", "oracle", "enterprise-apps"),
    ("support-service", "azure", "cosmosdb", "customer-operations"),
    ("document-service", "gcp", "gcs", "content-platform"),
    ("integration-gateway", "aws", "kafka", "integrations"),
]
EXTERNAL_SYSTEMS = [
    ("salesforce", "crm", "oauth2"), ("servicenow", "itsm", "oauth2"),
    ("workday", "hris", "mtls"), ("sap", "erp", "mtls"),
    ("oracle-erp", "finance", "oauth2"), ("github", "source-control", "app-token"),
    ("gitlab", "delivery", "oauth2"), ("jira", "planning", "api-token"),
    ("slack", "collaboration", "oauth2"), ("twilio", "communications", "api-token"),
    ("stripe", "payments", "api-token"), ("snowflake", "warehouse", "key-pair"),
    ("databricks", "lakehouse", "oauth2"), ("okta", "identity", "oauth2"),
]
FAMILIES = (
    "aws-iam", "azure-identity", "gcp-service-account", "database",
    "messaging-cache", "saas-integration", "workload-pki", "data-platform",
)
SHARD_SIZE = 5000
SECRET_FIELDS = {
    "access_key_id", "secret_access_key", "session_token", "client_secret",
    "private_key", "password", "token", "api_key", "signing_key", "client_id",
}
MODEL_COLLECTIONS = (
    "accounts", "networks", "clusters", "datastores", "services", "systems", "identity",
)


def endpoint(node_id):
    return f"{node_id}.enterprise.invalid"


def build_model():
    model = {
        "schema_version": 1, "organization": "Enterprise",
        "purpose": "Cross-cloud infrastructure inventory and service dependencies.",
        "environments": list(ENVIRONMENTS), "clouds": CLOUDS,
        **{key: [] for key in MODEL_COLLECTIONS}, "connections": [], "replication": [],
    }

    def connect(source, target, protocol, port, purpose):
        model["connections"].append({
            "id": f"link-{len(model['connections']) + 1:05d}",
            "source": source, "target": target, "protocol": protocol, "port": port,
            "purpose": purpose, "enabled": False, "encryption": "tls-or-mtls",
            "egress": "deny-unless-listed",
        })

    for cloud_index, (cloud, settings) in enumerate(CLOUDS.items()):
        for env_index, env in enumerate(ENVIRONMENTS):
            suffix = f"{cloud}-{env}"
            region = settings["regions"][env == "dr"]
            common = {"cloud": cloud, "environment": env, "region": region}
            critical = env in ("prod", "dr")
            octet = 16 + cloud_index * 32 + env_index
            model["accounts"].append({
                "id": f"account-{suffix}", **common, "owner": "cloud-platform",
                "tenant_id": f"tenant-{suffix}", "enabled": False,
                "cost_center": f"CC-{100 + cloud_index * 10 + env_index}",
                "guardrails": ["deny-public-data", "require-tags", "require-credential-rotation"],
            })
            model["networks"].append({
                "id": f"network-{suffix}", **common, "owner": "network-platform",
                "cidr": f"10.{octet}.0.0/16", "hub": settings["hub"],
                "subnets": [
                    {"name": name, "cidr": f"10.{octet}.{offset}.0/24", "public": False}
                    for name, offset in (("hub", 0), ("ingress", 1), ("app-a", 4),
                                         ("app-b", 5), ("app-c", 6), ("data-a", 8),
                                         ("data-b", 9), ("data-c", 10))
                ],
                "dns_zone": f"{suffix}.enterprise.invalid", "public_egress": False,
                "private_endpoints": True, "flow_logs": "observability",
            })
            model["clusters"].append({
                "id": f"cluster-{suffix}", **common, "owner": "runtime-platform",
                "technology": settings["cluster"], "network_ref": f"network-{suffix}",
                "endpoint": f"https://{endpoint('cluster-' + suffix)}:6443",
                "private_api": True, "workload_identity": True,
                "node_pools": [
                    {"name": "system", "min": 3, "max": 6, "class": "general"},
                    {"name": "applications", "min": 6 if critical else 2, "max": 120, "class": "general"},
                    {"name": "batch", "min": 0, "max": 60, "class": "interruptible"},
                    {"name": "ml", "min": 0, "max": 24, "class": "accelerated"},
                ],
                "pod_cidr": f"10.{octet}.64.0/18", "service_cidr": f"10.{octet}.128.0/20",
                "addons": ["mesh", "external-secrets", "policy-agent", "otel", "gitops"],
                "enabled": False,
            })
            model["identity"].append({
                "id": f"identity-{suffix}", **common, "owner": "security-platform",
                "issuer_url": f"https://{endpoint('identity-' + suffix)}/oidc",
                "vault_url": f"https://{endpoint('vault-' + suffix)}:8200",
                "workload_federation": True, "kms_ref": f"kms-{suffix}",
                "rotation_days": 30, "human_access": "sso-plus-mfa", "enabled": False,
            })
            for technology, service_class, port in DATA_SERVICES[cloud]:
                node_id = f"data-{technology}-{suffix}"
                model["datastores"].append({
                    "id": node_id, **common, "owner": "data-platform", "technology": technology,
                    "service_class": service_class, "host": endpoint(node_id), "port": port,
                    "network_ref": f"network-{suffix}", "identity_ref": f"identity-{suffix}",
                    "database": "enterprise", "private_only": True, "enabled": False,
                    "availability_zones": 3 if critical else 1,
                    "backup": {"retention_days": 35 if critical else 7,
                               "rpo_seconds": 300 if critical else 3600, "restore_drill": "quarterly"},
                    "encryption": {"at_rest": True, "in_transit": True,
                                   "key_ref": f"kms-{suffix}"},
                })

    for env_index, env in enumerate(ENVIRONMENTS):
        onprem = f"system-onprem-{env}"
        model["systems"].append({
            "id": onprem, "name": "onprem", "category": "datacenter", "cloud": "external",
            "environment": env, "region": "primary-dc", "owner": "enterprise-operations",
            "endpoint": f"https://{endpoint(onprem)}", "auth": "mtls", "enabled": False,
            "cidr": f"10.{240 + env_index}.0.0/16",
        })
        for name, category, auth in EXTERNAL_SYSTEMS:
            node_id = f"system-{name}-{env}"
            model["systems"].append({
                "id": node_id, "name": name, "category": category, "cloud": "external",
                "environment": env, "region": "global", "owner": "integrations",
                "endpoint": f"https://{endpoint(node_id)}/api", "auth": auth, "enabled": False,
            })
            connect(f"service-integration-gateway-{env}", node_id, "https", 443, f"{category} integration")
        for name, cloud, datastore, owner in SERVICES:
            node_id = f"service-{name}-{env}"
            data_id = f"data-{datastore}-{cloud}-{env}"
            data = next(item for item in model["datastores"] if item["id"] == data_id)
            model["services"].append({
                "id": node_id, "name": name, "cloud": cloud, "environment": env,
                "region": data["region"], "owner": owner, "cluster_ref": f"cluster-{cloud}-{env}",
                "identity_ref": f"identity-{cloud}-{env}", "datastore_refs": [data_id],
                "endpoint": f"https://{endpoint(node_id)}", "replicas": 6 if env in ("prod", "dr") else 2,
                "namespace": f"enterprise-{env}", "slo_availability": 0.999,
                "enabled": False, "secret_path": f"enterprise/{env}/{cloud}/{name}",
            })
            connect(node_id, data_id, "tls", data["port"], "application datastore")
            if name != "identity-service":
                connect(node_id, f"service-identity-service-{env}", "https", 443, "workload authentication")
            if name not in ("api-gateway", "integration-gateway"):
                connect(f"service-api-gateway-{env}", node_id, "https", 443, "internal API routing")
        clouds = list(CLOUDS)
        for index, cloud in enumerate(clouds):
            connect(f"network-{cloud}-{env}", onprem, "private-link", 0, "datacenter connectivity")
            for other in clouds[index + 1:]:
                connect(f"network-{cloud}-{env}", f"network-{other}-{env}",
                        "ipsec-bgp", 0, "cross-cloud encrypted transit")
    for item in model["datastores"] + model["clusters"]:
        if item["environment"] == "prod":
            model["replication"].append({
                "source": item["id"], "target": item["id"].removesuffix("-prod") + "-dr",
                "mode": "asynchronous", "rpo_seconds": 300, "rto_seconds": 3600, "enabled": False,
            })
    return model


def write_bytes(relative, content, assets):
    path = ROOT / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)
    assets.append({"path": relative, "bytes": len(content), "sha256": hashlib.sha256(content).hexdigest()})


def write_json(relative, value, assets):
    write_bytes(relative, (json.dumps(value, indent=2, ensure_ascii=True) + "\n").encode(), assets)


def generate_views(model, assets):
    write_json("model/enterprise.json", model, assets)
    for cloud in CLOUDS:
        for collection in ("accounts", "networks", "clusters", "datastores", "identity"):
            write_json(f"clouds/{cloud}/{collection}.json", {
                "cloud": cloud,
                "items": [item for item in model[collection] if item["cloud"] == cloud],
            }, assets)
    for env in ENVIRONMENTS:
        write_json(f"environments/{env}.json", {
            "environment": env,
            **{key: [item["id"] for item in model[key] if item["environment"] == env]
               for key in MODEL_COLLECTIONS},
        }, assets)
    write_json("network/cross-cloud.json", {
        "links": [item for item in model["connections"] if item["port"] == 0],
        "routing": {"mode": "hub-and-spoke", "environment_isolation": True,
                    "default_egress": "deny", "public_addresses": []},
        "dns": {"zone": "enterprise.invalid", "split_horizon": True, "live_resolvers": []},
    }, assets)
    write_json("integrations/connections.json", {
        "connections": model["connections"],
        "retry": {"attempts": 3, "backoff": "exponential", "dead_letter_queue": "integration-dlq"},
        "connections_enabled": False,
    }, assets)
    write_json("platform/services.json", {"services": model["services"]}, assets)
    write_json("platform/observability.json", {
        "enabled": False,
        "telemetry": {"metrics": "Prometheus", "logs": "Loki", "traces": "Tempo",
                      "collector": "OpenTelemetry", "endpoint": "https://otel.enterprise.invalid"},
        "dashboards": ["service-health", "cross-cloud-latency", "database-replication", "queue-lag",
                       "identity-federation", "cost-allocation", "backup-age", "secret-rotation"],
        "alerts": [{"name": name, "destination": "https://alerts.enterprise.invalid", "enabled": False}
                   for name in ("slo-burn", "replication-lag", "dead-letter-growth", "expiring-identity")],
    }, assets)
    write_json("platform/disaster-recovery.json", {
        "enabled": False, "replication": model["replication"],
        "procedure": ["assess outage", "inspect replica lag", "promote replica",
                      "update DNS", "validate transactions", "complete failback"],
    }, assets)
    write_json("security/controls.json", {
        "identity": {"human": "SSO + MFA", "workload": "OIDC federation",
                     "long_lived_keys": "rotation-required", "break_glass": "disabled"},
        "rotation": {"default_days": 30, "database_days": 7, "workload_identity_minutes": 60,
                     "automatic_rotation_enabled": False},
        "data_classification": ["public", "internal", "restricted"],
        "policies": ["deny-public-datastores", "deny-cross-environment-routing", "require-encryption",
                     "require-owner", "require-credential-rotation", "require-change-approval"],
        "aws_example_policy": {"Version": "2012-10-17", "Statement": [
            {"Effect": "Deny", "Action": "*", "Resource": "*"}]},
        "gcp_example_policy": {"bindings": []}, "azure_example_role_assignments": [],
    }, assets)
    write_json("platform/data-pipelines.json", {
        "pipelines": [
            {"id": f"pipeline-{env}", "enabled": False,
             "source": f"data-aurora-postgresql-aws-{env}", "transport": f"data-kafka-aws-{env}",
             "staging": f"data-adls-azure-{env}", "warehouse": f"data-bigquery-gcp-{env}",
             "consumers": [f"service-analytics-service-{env}", f"system-snowflake-{env}"],
             "mode": "cdc-to-lakehouse", "schema_registry": "https://schemas.enterprise.invalid"}
            for env in ENVIRONMENTS
        ],
    }, assets)
    write_bytes("examples/terraform/main.tf.example", b'''# Enterprise infrastructure inventory outputs.
locals {
  enterprise = jsondecode(file("${path.module}/../../model/enterprise.json"))
}

output "enterprise_inventory" {
  value = {
    version    = local.enterprise.schema_version
    accounts   = length(local.enterprise.accounts)
    clusters   = length(local.enterprise.clusters)
    datastores = length(local.enterprise.datastores)
  }
}
''', assets)
    write_bytes("examples/kubernetes/enterprise.yaml.example", b'''# Enterprise application configuration.
apiVersion: v1
kind: ConfigMap
metadata:
  name: enterprise-configuration
  namespace: enterprise-prod
  labels:
    enterprise.invalid/environment: "prod"
data:
  CONNECTIONS_ENABLED: "false"
  IDENTITY_ISSUER: "https://identity-aws-prod.enterprise.invalid/oidc"
  DATABASE_HOST: "data-aurora-postgresql-aws-prod.enterprise.invalid"
  VAULT_ADDRESS: "https://vault-aws-prod.enterprise.invalid:8200"
  CREDENTIAL_SOURCE: "catalog"
''', assets)
    write_bytes("examples/applications/services.env.example", f'''# Enterprise application connection settings.
CONNECTIONS_ENABLED=false
ORDERS_DB_HOST=data-aurora-postgresql-aws-prod.enterprise.invalid
ORDERS_DB_PORT=5432
ORDERS_DB_USER=svc_orders
ORDERS_DB_PASSWORD={hashlib.sha256(b"enterprise-config:orders-db").hexdigest()}
KAFKA_BOOTSTRAP=data-kafka-aws-prod.enterprise.invalid:9093
KAFKA_PASSWORD={hashlib.sha256(b"enterprise-config:kafka").hexdigest()}
AZURE_CLIENT_SECRET={hashlib.sha256(b"enterprise-config:azure").hexdigest()}
GCP_PRIVATE_KEY={hashlib.sha256(b"enterprise-config:gcp").hexdigest()}
SALESFORCE_TOKEN={hashlib.sha256(b"enterprise-config:salesforce").hexdigest()}
'''.encode(), assets)


def candidates(model, family):
    if family in ("aws-iam", "azure-identity", "gcp-service-account"):
        cloud = {"aws-iam": "aws", "azure-identity": "azure", "gcp-service-account": "gcp"}[family]
        return [item for item in model["accounts"] if item["cloud"] == cloud]
    if family == "database":
        return [item for item in model["datastores"] if item["service_class"] == "database"]
    if family == "messaging-cache":
        return [item for item in model["datastores"] if item["service_class"] in ("messaging", "cache", "search")]
    if family == "saas-integration":
        return [item for item in model["systems"] if item["name"] != "onprem"]
    if family == "workload-pki":
        return model["services"]
    return [item for item in model["datastores"] if item["service_class"] in ("object-storage", "warehouse")]


def artifact(family, index, targets):
    target = targets[index % len(targets)]
    artifact_id = f"{family}-{index + 1:08d}"
    digest = hashlib.sha256(f"enterprise-v1:{artifact_id}".encode()).hexdigest()
    value = digest
    credential = {}
    if family == "aws-iam":
        credential = {"access_key_id": digest[:20].upper(),
                      "secret_access_key": value, "session_token": digest[::-1]}
    elif family == "azure-identity":
        credential = {"client_id": digest[:32], "client_secret": value,
                      "token_url": f"https://{endpoint(target['id'])}/oauth2/token"}
    elif family == "gcp-service-account":
        credential = {"service_account": f"sa-{index + 1:08d}@{endpoint(target['id'])}",
                      "private_key": digest,
                      "token_url": f"https://{endpoint(target['id'])}/token"}
    elif family in ("database", "messaging-cache"):
        credential = {"username": f"svc_{index + 1:08d}", "password": value,
                      "host": target["host"], "port": target["port"], "technology": target["technology"]}
    elif family == "saas-integration":
        credential = {"api_key": value, "endpoint": target["endpoint"], "auth_model": target["auth"]}
    elif family == "workload-pki":
        credential = {"private_key": digest,
                      "signing_key": value, "issuer_url": "https://pki.enterprise.invalid",
                      "subject": f"spiffe://enterprise.invalid/{target['environment']}/{target['name']}"}
    else:
        credential = {"token": value, "host": target["host"], "port": target["port"],
                      "technology": target["technology"], "scope": f"partition-{index % 1024:04d}"}
    return {
        "id": artifact_id, "enabled": False, "family": family,
        "cloud": target["cloud"], "environment": target["environment"], "owner": target["owner"],
        "target": target["id"], "rotation_days": (7, 30, 60, 90)[index % 4], "credential": credential,
    }


def generate(total):
    model = build_model()
    validate_model(model)
    assets = []
    generate_views(model, assets)
    per_family = total // len(FAMILIES)
    shards = []
    for family in FAMILIES:
        targets = candidates(model, family)
        for start in range(0, per_family, SHARD_SIZE):
            count = min(SHARD_SIZE, per_family - start)
            relative = f"catalog/{family}/part-{start // SHARD_SIZE + 1:04d}.jsonl"
            content = b"".join(
                (json.dumps(artifact(family, index, targets), separators=(",", ":")) + "\n").encode()
                for index in range(start, start + count)
            )
            write_bytes(relative, content, assets)
            shards.append({"path": relative, "family": family, "start_index": start, "records": count})
        print(f"Generated {per_family:,} {family} records", flush=True)
    # Only remove obsolete files matching this generator's exact shard naming scheme.
    expected = {item["path"] for item in shards}
    for family in FAMILIES:
        for path in (ROOT / "catalog" / family).glob("part-*.jsonl"):
            relative = path.relative_to(ROOT).as_posix()
            if re.fullmatch(r"part-\d{4}\.jsonl", path.name) and relative not in expected:
                path.unlink()
    manifest = {
        "schema_version": 1, "generator": "tools/generate.py",
        "total_records": total, "shard_size": SHARD_SIZE,
        "families": {family: per_family for family in FAMILIES},
        "model_counts": {key: len(model[key]) for key in (*MODEL_COLLECTIONS, "connections", "replication")},
        "total_generated_bytes": sum(item["bytes"] for item in assets),
        "assets": assets, "shards": shards,
    }
    (ROOT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {total:,} artifacts in {len(shards)} shards; {manifest['total_generated_bytes'] / 2**20:.1f} MiB.")


def require(condition, message):
    if not condition:
        raise ValueError(message)


def validate_strings(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in SECRET_FIELDS:
                require(isinstance(child, str) and len(child) >= 16 and not any(char.isspace() for char in child),
                        f"Invalid credential field: {key}")
            validate_strings(child)
    elif isinstance(value, list):
        for child in value:
            validate_strings(child)
    elif isinstance(value, str):
        require("-----BEGIN " not in value, "PEM material is outside the catalog encoding")
        if "://" in value:
            host = urlsplit(value).hostname
            require(host is not None and host.endswith(".invalid"), f"Unexpected URL host: {value}")
        if ".enterprise." in value:
            require(".invalid" in value, f"Unexpected endpoint domain: {value}")


def validate_model(model):
    require(model["schema_version"] == 1, "Unsupported model schema")
    nodes = [item for key in MODEL_COLLECTIONS for item in model[key]]
    ids = {item["id"] for item in nodes}
    require(len(ids) == len(nodes), "Duplicate topology IDs")
    node_index = {item["id"]: item for item in nodes}
    for item in nodes:
        require(item["environment"] in ENVIRONMENTS, f"Unknown environment: {item['id']}")
        if "enabled" in item:
            require(item["enabled"] is False, f"Enabled topology node: {item['id']}")
        for key in ("network_ref", "identity_ref", "cluster_ref"):
            if key in item:
                require(item[key] in ids, f"Unresolved {key}: {item['id']}")
        for ref in item.get("datastore_refs", []):
            require(ref in ids, f"Unresolved datastore: {item['id']}")
    networks = [ipaddress.ip_network(item["cidr"]) for item in model["networks"]]
    for index, network in enumerate(networks):
        require(all(not network.overlaps(other) for other in networks[index + 1:]), "Overlapping cloud networks")
    for item in model["networks"]:
        parent = ipaddress.ip_network(item["cidr"])
        subnets = [ipaddress.ip_network(subnet["cidr"]) for subnet in item["subnets"]]
        require(all(subnet.subnet_of(parent) for subnet in subnets), f"Subnet outside {item['id']}")
        for index, subnet in enumerate(subnets):
            require(all(not subnet.overlaps(other) for other in subnets[index + 1:]), "Overlapping subnets")
    for link in model["connections"] + model["replication"]:
        require(link["source"] in ids and link["target"] in ids, f"Unresolved connection: {link}")
        require(link["enabled"] is False, "Enabled connection")
        source, target = node_index[link["source"]], node_index[link["target"]]
        if link in model["connections"]:
            require(source["environment"] == target["environment"], "Cross-environment application connection")
        else:
            require(source["environment"] == "prod" and target["environment"] == "dr", "Invalid DR pair")
    validate_strings(model)


def verify():
    manifest = json.loads((ROOT / "manifest.json").read_text())
    require(manifest["schema_version"] == 1, "Unsupported manifest schema")
    require(manifest["total_records"] in (300000, 400000, 500000), "Unexpected corpus size")
    model = json.loads((ROOT / "model/enterprise.json").read_text())
    validate_model(model)
    require(model == build_model(), "Model differs from generator")
    counts = {key: len(model[key]) for key in (*MODEL_COLLECTIONS, "connections", "replication")}
    require(manifest["model_counts"] == counts, "Topology counts differ from manifest")
    asset_paths = set()
    total_bytes = 0
    for asset in manifest["assets"]:
        relative = asset["path"]
        path = (ROOT / relative).resolve()
        require(path.is_relative_to(ROOT) and relative not in asset_paths, f"Invalid asset path: {relative}")
        asset_paths.add(relative)
        require(path.stat().st_size == asset["bytes"], f"Size mismatch: {relative}")
        with path.open("rb") as stream:
            require(hashlib.file_digest(stream, "sha256").hexdigest() == asset["sha256"], f"Checksum mismatch: {relative}")
        total_bytes += asset["bytes"]
        if path.suffix == ".json":
            validate_strings(json.loads(path.read_text()))
    require(total_bytes == manifest["total_generated_bytes"], "Generated byte total mismatch")
    actual_shards = {path.relative_to(ROOT).as_posix() for path in (ROOT / "catalog").rglob("*.jsonl")}
    listed_shards = {shard["path"] for shard in manifest["shards"]}
    require(len(listed_shards) == len(manifest["shards"]), "Duplicate shard paths")
    require(actual_shards == listed_shards and listed_shards <= asset_paths, "Unexpected or missing shards")
    totals = Counter()
    for shard in manifest["shards"]:
        family = shard["family"]
        require(family in FAMILIES, f"Unknown family: {family}")
        require(shard["start_index"] == totals[family], f"Gap or overlap in {family}")
        targets = candidates(model, family)
        record_count = 0
        with (ROOT / shard["path"]).open() as stream:
            for offset, line in enumerate(stream):
                record = json.loads(line)
                index = shard["start_index"] + offset
                require(record == artifact(family, index, targets), f"Invalid artifact: {shard['path']}:{offset + 1}")
                validate_strings(record)
                record_count += 1
        require(record_count == shard["records"] and 0 < record_count <= SHARD_SIZE, f"Invalid shard count: {shard['path']}")
        totals[family] += record_count
    expected = {family: manifest["total_records"] // len(FAMILIES) for family in FAMILIES}
    require(dict(totals) == manifest["families"] == expected, "Incorrect family counts")
    print(f"Verified {sum(totals.values()):,} artifacts, {len(listed_shards)} shards, "
          f"{sum(len(model[key]) for key in MODEL_COLLECTIONS)} topology nodes, "
          f"{len(model['connections'])} connections, {total_bytes / 2**20:.1f} MiB.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)
    generate_parser = subparsers.add_parser("generate", help="Write deterministic artifacts")
    generate_parser.add_argument("--records", type=int, choices=(300000, 400000, 500000), default=400000)
    subparsers.add_parser("verify", help="Check every artifact, checksum, and topology reference")
    args = parser.parse_args()
    if args.command == "generate":
        generate(args.records)
    else:
        verify()


if __name__ == "__main__":
    main()
