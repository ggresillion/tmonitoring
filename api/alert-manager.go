package api

import (
	"bytes"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

type AlertManagerController struct {
}

func NewAlertManagerController() *AlertManagerController {
	return &AlertManagerController{}
}

func (ct *AlertManagerController) RegisterAlertManagerRoutes(r *gin.RouterGroup) {
	r.GET("/alerts", ct.getAlerts)
}

func (ct *AlertManagerController) getAlerts(c *gin.Context) {
	host := c.Query("host")
	if host == "" {
		c.JSON(401, gin.H{"error": "missing host param"})
		return
	}
	if !strings.HasPrefix(host, "https://") {
		host = "https://" + host
	}
	if !strings.HasSuffix(host, "/") {
		host = host + "/"
	}

	res, err := http.Get(host + "api/v1/alerts")
	if err != nil {
		c.JSON(500, err)
		return
	}
	b := new(bytes.Buffer)
	var body interface{}
	err = json.NewEncoder(b).Encode(res.Body)
	if err != nil {
		c.JSON(500, err)
		return
	}
	err = json.NewDecoder(res.Body).Decode(&body)
	if err != nil {
		c.JSON(500, err)
		return
	}
	c.JSON(200, body)
}
