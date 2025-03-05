FROM openjdk:22
WORKDIR /tmp/
EXPOSE 8080
COPY target/MyTodoList-0.0.1-SNAPSHOT.jar MyTodoList.jar
RUN mkdir -p /mtdrworkshop/creds
COPY wallet/ /mtdrworkshop/creds
ENV _JAVA_OPTIONS=-Dlogging.level.org.springframework=INFO
ENTRYPOINT ["java","-jar","MyTodoList.jar"]