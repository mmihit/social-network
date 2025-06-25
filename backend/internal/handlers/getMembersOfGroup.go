package handlers

import (
	"fmt"
	"net/http"
	"social-network/internal/models"
	"social-network/internal/tools"
	"strconv"
)

type getMembersResponse struct {
	Members []member `json:"members"`
}

type member struct {
	Id       int    `json:"id"`
	NickName string `json:"nickName"`
	Status   string `json:"status"`
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

	creatorId, err := models.Db.GetGroupCreator(groupId)
	if err != nil {
		fmt.Println(err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	if creatorId != userId {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "you are not the creator of this group")
		return
	}

	membersId, err := models.Db.GetGroupMembers(groupId)
	if err != nil {
		fmt.Println(err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	var members []member

	for _, memberId := range membersId {
		user, err := models.Db.GetUserInfo(memberId)
		if err != nil {
			fmt.Println(err)
			tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
			return
		}
		var status = "member"
		if memberId == creatorId {
			status = "creator"
		}

		var member = member{
			Id:       user.ID,
			NickName: user.Nickname,
			Status:   status,
		}

		members = append(members, member)
	}

	var response = getMembersResponse{
		Members: members,
	}

	tools.JSONResponse(w, http.StatusOK, response)
}
