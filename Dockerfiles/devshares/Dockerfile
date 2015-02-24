FROM ubuntu:14.04
MAINTAINER Spartako <fabio.castaldo@lambdago.it>

RUN apt-get update &&\
    apt-get install -y cmake git libreadline-dev uuid-dev g++ libdb++-dev libdb-dev zip libssl-dev openssl build-essential python-dev autotools-dev libicu-dev libbz2-dev libboost-dev libboost-all-dev locales && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN locale-gen en_US en_US.UTF-8 &&\
    dpkg-reconfigure locales

RUN git clone https://github.com/BitShares/DevShares.git

RUN cd  DevShares &&\
    git checkout dvs/0.6.3 &&\
    git submodule init &&\
    git submodule update &&\
    cmake . &&\
    export LC_ALL="en_US.UTF-8" &&\
    make 

