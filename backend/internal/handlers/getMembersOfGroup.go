package handlers

import (
	"fmt"
	"net/http"
	"social-network/internal/models"
	"social-network/internal/tools"
	"strconv"
)

type getMembersResponse struct {
	Members []models.Member `json:"members"`
}

func GetAllMembersOfGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		tools.ErrorJSONResponse(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	userId := r.Context().Value("userID").(int)
	fmt.Println(userId)
	fmt.Println(r.PathValue("groupID"))
	groupId, err := strconv.Atoi(r.PathValue("groupID"))
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "group id not valid")
		return
	}

	status, err := models.Db.GetUserGroupStatus(groupId, userId)
	if err != nil {
		fmt.Println(err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	if status != "creator" && status != "member" {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "you are not a member on this group")
		return
	}

	members, err := models.Db.GetGroupMembers(groupId)
	if err != nil {
		fmt.Println(err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	var response = getMembersResponse{
		Members: members,
	}

	tools.JSONResponse(w, http.StatusOK, response)
}
