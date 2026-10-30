FROM mcr.microsoft.com/devcontainers/javascript-node:1-bookworm

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    libatomic1 \
    wget && \
    rm -rf /var/lib/apt/lists/* && \
    update-ca-certificates

COPY .infra/versions.env /tmp/versions.env
ARG TARGETARCH
RUN . /tmp/versions.env && \
    npm install --global "n@${N_VERSION}" && \
    curl -LsSf "https://astral.sh/uv/${UV_VERSION}/install.sh" | env UV_INSTALL_DIR=/usr/local/bin sh && \
    n "${NODE_VERSION}" && \
    npm install --global "npm@${NPM_VERSION}" && \
    case "${TARGETARCH}" in \
      amd64) hugo_arch="linux-amd64"; sass_arch="linux-x64" ;; \
      arm64) hugo_arch="linux-arm64"; sass_arch="linux-arm64" ;; \
      *) echo "Unsupported TARGETARCH: ${TARGETARCH}" >&2; exit 1 ;; \
    esac && \
    . /tmp/versions.env && \
    archive="hugo_extended_${HUGO_VERSION}_${hugo_arch}.tar.gz" && \
    wget --quiet "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${archive}" && \
    tar -xzf "${archive}" hugo && \
    install -m 0755 hugo /usr/local/bin/hugo && \
    rm -f hugo "${archive}" && \
    archive="dart-sass-${DART_SASS_VERSION}-${sass_arch}.tar.gz" && \
    wget --quiet "https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/${archive}" && \
    tar -xzf "${archive}" -C /opt && \
    ln -s /opt/dart-sass/sass /usr/local/bin/sass && \
    rm -f "${archive}" /tmp/versions.env

COPY .devcontainer/dev-entrypoint.sh /usr/local/bin/dev-entrypoint
RUN chmod 0755 /usr/local/bin/dev-entrypoint

WORKDIR /workspace
