package handlers

import (
	"fmt"
	"net/http"
	"social-network/internal/models"
	"social-network/internal/tools"
	"strconv"
)

type getFollowerToInviteResponse struct {
	Users   []models.User `json:"users"`
	HasMore bool          `json:"hasMore"`
}

func GetFollowersToInvite(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		tools.ErrorJSONResponse(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	userId := r.Context().Value("userID").(int)
	groupId, err := strconv.Atoi(r.PathValue("groupID"))
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "expected group id")
		return
	}

	status, err := models.Db.GetUserGroupStatus(groupId, userId)
	if err != nil {
		fmt.Println("1", err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	if status != "member" && status != "creator" {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "you're not a member on this group")
		return
	}

	searchInput := r.URL.Query().Get("q")
	offset, err := strconv.Atoi(r.URL.Query().Get("offset"))
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "expected offset value")
		return
	}

	users, hasMore, err := models.Db.GetUsersForGroupInvitation(groupId, offset, searchInput)
	if err != nil {
		fmt.Println("2", err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	var responseApi = getFollowerToInviteResponse{
		Users:   users,
		HasMore: hasMore,
	}

	tools.JSONResponse(w, http.StatusOK, responseApi)
}
