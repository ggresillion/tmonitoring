package api

import (
	"github.com/gin-gonic/gin"
	"github.com/magicsong/sonargo/sonar"
	"net/http"
	"strconv"
	"strings"
)

type Metrics struct {
	CodeSmells      float64 `json:"codeSmells"`
	Bugs            float64 `json:"bugs"`
	Vulnerabilities float64 `json:"vulnerabilities"`
	Debt            float64 `json:"debt"`
	Coverage        float64 `json:"coverage"`
	Duplication     float64 `json:"duplication"`
}

type SonarQubeController struct {
}

func NewSonarQubeController() *SonarQubeController {
	return &SonarQubeController{}
}

func (ct *SonarQubeController) RegisterSonarQubeRoutes(r *gin.RouterGroup) {
	r.GET("/:id/measures", ct.getOverview)
}

func mapToMetrics(sMeasures []*sonargo.SonarMeasure) *Metrics {
	var measures Metrics
	for _, sMeasure := range sMeasures {
		val, _ := strconv.ParseFloat(sMeasure.Value, 32)
		switch sMeasure.Metric {
		case "bugs":
			measures.Bugs = val
			break
		case "code_smells":
			measures.CodeSmells = val
			break
		case "coverage":
			measures.Coverage = val
			break
		case "sqale_index":
			measures.Debt = val
			break
		case "duplicated_blocks":
			measures.Duplication = val
			break
		case "vulnerabilities":
			measures.Vulnerabilities = val
			break
		}
	}
	return &measures
}

func (ct *SonarQubeController) getOverview(c *gin.Context) {
	projectKey := c.Param("id")
	host := c.Query("host")
	token := c.Query("token")

	if host == "" || token == "" {
		c.JSON(401, gin.H{"error": "missing host or token param"})
		return
	}
	if !strings.HasPrefix(host, "https://") {
		host = "https://" + host
	}
	if strings.HasSuffix(host, "/") {
		host = strings.TrimSuffix(host, "/")
	}

	client, err := sonargo.NewClient(host+"/api", token, "")
	if err != nil {
		c.JSON(401, err)
		return
	}
	res, _, err := client.Measures.Component(&sonargo.MeasuresComponentOption{
		Component:  projectKey,
		MetricKeys: "bugs,vulnerabilities,code_smells,sqale_index,coverage,duplicated_blocks",
	})
	if err != nil {
		c.JSON(401, err.Error())
		return
	}
	sMeasures := res.Component.Measures
	metrics := mapToMetrics(sMeasures)
	c.JSON(http.StatusOK, metrics)
}
