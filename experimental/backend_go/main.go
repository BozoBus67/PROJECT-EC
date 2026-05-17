package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type StatusResponse struct {
	Status string `json:"status"`
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(StatusResponse{Status: "ok"})
}

func main() {
	http.HandleFunc("/", rootHandler)
	log.Println("listening on :9293")
	log.Fatal(http.ListenAndServe(":9293", nil))
}
