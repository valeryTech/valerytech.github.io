FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bookworm

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    wget && \
    rm -rf /var/lib/apt/lists/* && \
    update-ca-certificates

COPY .infra/versions.env /tmp/versions.env
ARG TARGETARCH
RUN npm install --global n && \
    . /tmp/versions.env && \
    n "${NODE_VERSION}" && \
    case "${TARGETARCH}" in \
      amd64) hugo_arch="linux-amd64" ;; \
      arm64) hugo_arch="linux-arm64" ;; \
      *) echo "Unsupported TARGETARCH: ${TARGETARCH}" >&2; exit 1 ;; \
    esac && \
    . /tmp/versions.env && \
    archive="hugo_extended_${HUGO_VERSION}_${hugo_arch}.tar.gz" && \
    wget --quiet "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${archive}" && \
    tar -xzf "${archive}" hugo && \
    install -m 0755 hugo /usr/local/bin/hugo && \
    rm -f hugo "${archive}" /tmp/versions.env

COPY .devcontainer/dev-entrypoint.sh /usr/local/bin/dev-entrypoint
RUN chmod 0755 /usr/local/bin/dev-entrypoint

WORKDIR /workspace
