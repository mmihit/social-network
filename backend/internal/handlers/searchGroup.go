package handlers

import (
	"fmt"
	"net/http"
	"social-network/internal/models"
	"social-network/internal/tools"
	"strconv"
	"strings"
)

type SearchGroupsResponse struct {
	Groups  []models.Group `json:"groups"`
	Message string         `json:"message"`
	HasMore bool           `json:"hasMore"`
}

func SearchGroups(w http.ResponseWriter, r *http.Request) {
	fmt.Println("test this")
	if r.Method != http.MethodGet {
		tools.ErrorJSONResponse(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	userId := r.Context().Value("userID").(int)

	searchInput := strings.TrimSpace(r.URL.Query().Get("q"))

	offset, err := strconv.Atoi(r.URL.Query().Get("offset"))
	if err != nil {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "expected offset value")
		return
	}
	fmt.Println(offset)
	if offset < 1 {
		tools.ErrorJSONResponse(w, http.StatusBadRequest, "expected offset value")
		return
	}

	groups, hasMore, err := models.Db.SearchForGroup(offset, userId, searchInput)
	if err != nil {
		fmt.Println(err)
		tools.ErrorJSONResponse(w, http.StatusInternalServerError, "internal server error")
		return
	}

	var response = SearchGroupsResponse{
		Groups:  groups,
		HasMore: hasMore,
	}

	if len(groups) == 0 {
		if offset > 1 {
			response.Message = "no more results"
		} else {
			response.Message = "don't exist any group for display it"
		}
	}

	tools.JSONResponse(w, http.StatusOK, response)
}
