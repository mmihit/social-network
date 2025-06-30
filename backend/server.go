package main

import (
	"fmt"
	"net/http"
	database "social-network/internal/db/sqlite"
	"social-network/internal/handlers"
	"social-network/internal/models"
)

func init() {
	db := database.CreateAllTables()
	models.Db = models.InitializeDb(db)
}

func main() {
	fmt.Println("00000")
	port := ":8080"
	fmt.Println("http://localhost" + port)
	http.HandleFunc("/api/register", handlers.HandleCORS(handlers.Register))
	http.HandleFunc("/api/login", handlers.HandleCORS(handlers.Login))
	http.HandleFunc("/api/logout", handlers.HandleCORS(handlers.TokenMiddleware(handlers.Logout)))

	http.HandleFunc("/api/privacy/update", handlers.HandleCORS(handlers.TokenMiddleware(handlers.UpdatePrivacy)))
	http.HandleFunc("/api/follow/{userID}", handlers.HandleCORS(handlers.TokenMiddleware(handlers.FollowUser))) // 1-need send notification func with ws | 2- need handling this cases: *when user follow himself  *when user follow a user already follower (follow the same follower 2 times)
	http.HandleFunc("/api/followResponse", handlers.HandleCORS(handlers.TokenMiddleware(handlers.FollowResponse)))
	http.HandleFunc("/api/createGroup", handlers.HandleCORS(handlers.TokenMiddleware(handlers.CreateGroup)))
	http.HandleFunc("/api/groups/{groupID}/getGroup", handlers.HandleCORS(handlers.TokenMiddleware(handlers.GetGroupHandler)))
	http.HandleFunc("/api/groups/{groupID}/sentJoinRequest", handlers.HandleCORS(handlers.TokenMiddleware(handlers.SentJoinGroup)))
	http.HandleFunc("/api/groups/{groupID}/joinInvitation", handlers.HandleCORS(handlers.TokenMiddleware(handlers.JoinInvitation)))
	http.HandleFunc("/api/groups/{groupID}/getMembers", handlers.HandleCORS(handlers.TokenMiddleware(handlers.GetAllMembersOfGroup)))
	http.HandleFunc("/api/groups/{groupID}/addMember", handlers.HandleCORS(handlers.TokenMiddleware(handlers.AddMember)))
	http.HandleFunc("/api/groups/{groupID}/getFollowersToInvite", handlers.HandleCORS(handlers.TokenMiddleware(handlers.GetFollowersToInvite)))
	http.HandleFunc("/api/groups/search", handlers.HandleCORS(handlers.TokenMiddleware(handlers.SearchGroups)))
	// http.HandleFunc("/api/groups/myGroups", handlers.HandleCORS(handlers.TokenMiddleware(handlers.GetMyGroups)))

	http.HandleFunc("/api/groups", func(w http.ResponseWriter, r *http.Request) { fmt.Println("this is groups path") })

	http.HandleFunc("/api/posts", handlers.HandleCORS(handlers.TokenMiddleware(func(w http.ResponseWriter, r *http.Request) { fmt.Println("this is api/posts path") })))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) { fmt.Println("this is home path") })

	http.ListenAndServe(":8080", nil)
}
