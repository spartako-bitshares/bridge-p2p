FROM ubuntu:14.04
MAINTAINER Spartako <fabio.castaldo@lambdago.it>

RUN apt-get update &&\
    apt-get install -y wget
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN cd /root &&\
    wget --no-check-certificate https://bitcoin.org/bin/0.10.0/bitcoin-0.10.0-linux64.tar.gz &&\
    tar xvfz bitcoin-0.10.0-linux64.tar.gz &&\
    cd bitcoin-0.10.0 &&\
    cp -r bin /usr/ &&\
    cp -r include /usr/ &&\
    cp -r lib /usr/

RUN chmod a+x /usr/bin/*

# VOLUME ["/data"]
ENV DATA /data

# EXPOSE 8332 8333 6881 6882
EXPOSE 18332 18333 16881 16882

WORKDIR /data

# CMD ["btc_init"]

