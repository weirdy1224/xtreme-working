FROM judge0/compilers:1.4.0 AS production

ENV JUDGE0_HOMEPAGE "https://judge0.com"
LABEL homepage=$JUDGE0_HOMEPAGE

ENV JUDGE0_SOURCE_CODE "https://github.com/judge0/judge0"
LABEL source_code=$JUDGE0_SOURCE_CODE

ENV JUDGE0_MAINTAINER "Herman Zvonimir Došilović <hermanz.dosilovic@gmail.com>"
LABEL maintainer=$JUDGE0_MAINTAINER

ENV PATH "/usr/local/ruby-2.7.0/bin:/opt/.gem/bin:$PATH"
ENV GEM_HOME "/opt/.gem/"
ENV DATABASE_URL "postgresql://codeflow:codeflow123@postgres:5432/codeflow"  # Default, override in compose

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      cron \
      libpq-dev \
      postgresql-client \  # Added for psql
      sudo \
      dos2unix && \
    rm -rf /var/lib/apt/lists/* && \
    echo "gem: --no-document" > /root/.gemrc && \
    gem install bundler:2.1.4 && \
    npm install -g --unsafe-perm aglio@2.3.0

EXPOSE 2358

WORKDIR /api

COPY Gemfile* ./
RUN RAILS_ENV=production bundle

COPY cron /etc/cron.d
RUN cat /etc/cron.d/* | crontab -

COPY . .
COPY docker-entrypoint.sh /api/docker-entrypoint.sh  # Ensure this file exists
RUN chmod +x /api/docker-entrypoint.sh  # Make executable

# Convert all scripts to Unix line endings
RUN find /api -type f -exec dos2unix {} \;

ENTRYPOINT ["/api/docker-entrypoint.sh"]
CMD ["/api/scripts/server"]

RUN useradd -u 1000 -m -r judge0 && \
    echo "judge0 ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers && \
    chown judge0: /api/tmp/

USER judge0

ENV JUDGE0_VERSION "1.13.1"
LABEL version=$JUDGE0_VERSION

# Development stage
FROM production AS development
CMD ["sleep", "infinity"]