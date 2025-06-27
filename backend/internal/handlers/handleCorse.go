package handlers

import (
	"fmt"
	"net/http"
)

func HandleCORS(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if r.Method == http.MethodOptions {
			fmt.Println("enter")
			w.WriteHeader(http.StatusOK)
			return
		}

		fmt.Println("out")
		next.ServeHTTP(w, r)
	})
}
