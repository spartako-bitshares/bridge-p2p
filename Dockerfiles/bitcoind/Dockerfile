FROM ubuntu:14.04
MAINTAINER Spartako <fabio.castaldo@lambdago.it>

ADD ./bin /usr/local/bin
ADD ./bitcoin-0.10.0/bin /usr/local/bin
ADD ./bitcoin-0.10.0/include /usr/local/include
ADD ./bitcoin-0.10.0/lib /usr/local/lib
RUN chmod a+x /usr/local/bin/*

# VOLUME ["/data"]
ENV DATA /data

# EXPOSE 8332 8333 6881 6882
EXPOSE 18332 18333 16881 16882

WORKDIR /data

# CMD ["btc_init"]

