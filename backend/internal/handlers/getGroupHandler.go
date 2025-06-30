package handlers

import (
	"fmt"
	"net/http"
	"social-network/internal/models"
	"social-network/internal/tools"
	"strconv"
)

func GetGroupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		tools.ErrorJSONResponse(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	groupId, err := strconv.Atoi(r.PathValue("groupID"))
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "expected post Id")
		return
	}

	userId := r.Context().Value("userID").(int)

	var group models.Group

	group, err = models.Db.GetGroup(groupId)
	if err != nil {
		fmt.Println(err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	if group.ID == 0 {
		tools.ErrorJSONResponse(w, http.StatusNotFound, "this post not exists")
		return
	}

	status, err := models.Db.GetUserGroupStatus(groupId, userId)
	if err != nil {
		fmt.Println(err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	group.Status = status

	tools.JSONResponse(w, http.StatusOK, group)
}
