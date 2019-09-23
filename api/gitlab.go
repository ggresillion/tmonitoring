package api

import (
	"github.com/gin-gonic/gin"
	"github.com/xanzy/go-gitlab"
	"net/http"
	"strings"
	"time"
)

type GitlabController struct {
}

type Job struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Status string `json:"status"`
}

type User struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	AvatarURL string `json:"avatarUrl"`
}

type Commit struct {
	ID   string     `json:"id"`
	Name string     `json:"name"`
	User User       `json:"user"`
	Date *time.Time `json:"date"`
}

type Pipeline struct {
	ID     int        `json:"id"`
	Branch string     `json:"branch"`
	Commit Commit     `json:"commit"`
	Jobs   []Job      `json:"jobs"`
	Status string     `json:"status"`
	Date   *time.Time `json:"date"`
}

func NewGitlabController() *GitlabController {

	return &GitlabController{}
}

func (ct *GitlabController) RegisterGitlabRoutes(r *gin.RouterGroup) {
	r.GET("/pipelines", ct.getPipelines)
}

func (ct *GitlabController) getPipelines(c *gin.Context) {
	token := c.Query("token")
	host := c.Query("host")
	projectID := c.Query("projectId")
	if host == "" || token == "" || projectID == "" {
		c.JSON(401, gin.H{"error": "missing host, token or projectId param"})
		return
	}
	if !strings.HasPrefix(host, "https://") {
		host = "https://" + host
	}
	client := gitlab.NewClient(nil, token)
	client.SetBaseURL(host)

	var pipelines []Pipeline
	gJobs, _, _ := client.Jobs.ListProjectJobs(projectID, &gitlab.ListJobsOptions{})
	for _, gJob := range gJobs {
		var pipeline *Pipeline
		for i, p := range pipelines {
			if p.ID == gJob.Pipeline.ID {
				pipeline = &pipelines[i]
			}
		}
		if pipeline == nil {
			pipeline = &Pipeline{
				ID:     gJob.Pipeline.ID,
				Branch: gJob.Pipeline.Ref,
				Status: "passed",
				Commit: Commit{
					ID:   gJob.Commit.ID,
					Name: gJob.Commit.Title,
					User: User{
						ID:        gJob.User.ID,
						Name:      gJob.User.Name,
						AvatarURL: gJob.User.AvatarURL,
					},
					Date: gJob.Commit.CommittedDate,
				},
				Date: gJob.CreatedAt,
			}
			pipelines = append(pipelines, *pipeline)
		}
		if gJob.Pipeline.Status != "success" {
			pipeline.Status = gJob.Pipeline.Status
		}
		pipeline.Jobs = append(pipeline.Jobs, Job{ID: gJob.ID, Name: gJob.Name, Status: gJob.Status})
	}
	c.JSON(http.StatusOK, pipelines)
}
