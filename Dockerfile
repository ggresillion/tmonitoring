FROM golang:alpine as builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOARCH=amd64 GOOS=linux go build -o main .

FROM scratch
COPY --from=builder /app/main /app/main
ENTRYPOINT ["/app/main"]
