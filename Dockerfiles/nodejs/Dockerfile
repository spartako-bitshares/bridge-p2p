FROM ubuntu:14.04
MAINTAINER Spartako <fabio.castaldo@lambdago.it>

RUN apt-get update &&\
    apt-get install -y wget
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN cd /root &&\
    wget http://nodejs.org/dist/v0.12.0/node-v0.12.0-linux-x64.tar.gz &&\
    tar xvfz node-v0.12.0-linux-x64.tar.gz &&\
    cd node-v0.12.0-linux-x64 &&\
    cp -r bin /usr/ &&\
    cp -r include /usr/ &&\
    cp -r lib /usr/ &&\
    cp -r share /usr/    

CMD ["/bin/bash"]
