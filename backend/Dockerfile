FROM maven:3.8.2-jdk-11 AS build
COPY . /.
RUN mvn -f /pom.xml clean package

FROM adoptopenjdk/maven-openjdk11
RUN apt-get update \
	&& apt-get install -y curl \
	&& curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
	&& apt-get install -y nodejs \
	&& rm -rf /var/lib/apt/lists/*
COPY ./sonar-scanner/sonar-scanner-5.0.1.3006-linux /sonar-scanner/sonar-scanner-5.0.1.3006-linux
RUN chmod 755 /sonar-scanner/sonar-scanner-5.0.1.3006-linux/bin/sonar-scanner
RUN chmod -R 755 /sonar-scanner/sonar-scanner-5.0.1.3006-linux/jre
COPY --from=build /target/*.jar /app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
