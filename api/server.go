package api

import (
	"crypto/tls"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"

	"time"
)

func Start() {
	e := gin.Default()
	e.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		MaxAge: 12 * time.Hour,
	}))
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

	v1 := e.Group("/api/v1")

	v1.GET("", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	gitlabController := NewGitlabController()
	gitlabController.RegisterGitlabRoutes(v1.Group("/gitlab"))
	kubernetesController := NewKubernetesController()
	kubernetesController.RegisterKubernetesRoutes(v1.Group("/kubernetes"))
	alertManagerController := NewAlertManagerController()
	alertManagerController.RegisterAlertManagerRoutes(v1.Group("/alert-manager"))
	err := e.Run()
	if err != nil {
		panic(err)
	}
}
