package api

import (
	"github.com/gin-gonic/gin"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"net/http"
	"strings"
)

type Deployment struct {
	Name        string `json:"name"`
	PodsRunning int32  `json:"podsRunning"`
	PodsTotal   int32  `json:"podsTotal"`
	Status      string `json:"status"`
}

type StatefulSet struct {
	Name        string `json:"name"`
	PodsRunning int32  `json:"podsRunning"`
	PodsTotal   int32  `json:"podsTotal"`
	Status      string `json:"status"`
}

type ReplicaSet struct {
	Name        string `json:"name"`
	PodsRunning int32  `json:"podsRunning"`
	PodsTotal   int32  `json:"podsTotal"`
	Status      string `json:"status"`
}

type Pod struct {
	Name   string      `json:"name"`
	Status v1.PodPhase `json:"status"`
}

type Summary struct {
	Deployments  []Deployment  `json:"deployments"`
	StatefulSets []StatefulSet `json:"statefulSets"`
	ReplicaSets  []ReplicaSet  `json:"replicaSets"`
	Pods         []Pod         `json:"pods"`
}

type KubernetesController struct {
}

func NewKubernetesController() *KubernetesController {
	return &KubernetesController{}
}

func (ct *KubernetesController) RegisterKubernetesRoutes(r *gin.RouterGroup) {
	r.GET("/:namespace/summary", ct.getSummary)
}

func (ct *KubernetesController) getSummary(c *gin.Context) {
	host := c.Query("host")
	token := c.Query("token")
	namespace := c.Param("namespace")
	if host == "" || token == "" {
		c.JSON(401, gin.H{"error": "missing host or token param"})
		return
	}
	if !strings.HasPrefix(host, "https://") {
		host = "https://" + host
	}
	client, err := kubernetes.NewForConfig(&rest.Config{
		Host:        host,
		BearerToken: token,
	})
	if err != nil {
		c.JSON(401, err)
		return
	}
	kDeployments, err := client.AppsV1().Deployments(namespace).List(metav1.ListOptions{})
	if err != nil {
		c.JSON(401, err)
		return
	}
	var deployments []Deployment
	for _, kDeployment := range kDeployments.Items {
		status := "Failed"
		if kDeployment.Status.Replicas == kDeployment.Status.ReadyReplicas {
			status = "Running"
		}
		deployments = append(deployments,
			Deployment{
				Name:        kDeployment.Name,
				PodsRunning: kDeployment.Status.ReadyReplicas,
				PodsTotal:   kDeployment.Status.Replicas,
				Status:      status,
			})
	}

	kPods, _ := client.CoreV1().Pods(namespace).List(metav1.ListOptions{})
	var pods []Pod
	for _, kPod := range kPods.Items {
		pods = append(pods, Pod{Name: kPod.Name, Status: kPod.Status.Phase})
	}

	kStatefulSets, _ := client.AppsV1().StatefulSets(namespace).List(metav1.ListOptions{})
	var statefulSets []StatefulSet
	for _, kStatefulSet := range kStatefulSets.Items {
		status := "Failed"
		if kStatefulSet.Status.Replicas == kStatefulSet.Status.ReadyReplicas {
			status = "Running"
		}
		statefulSets = append(statefulSets,
			StatefulSet{
				Name:        kStatefulSet.Name,
				PodsRunning: kStatefulSet.Status.ReadyReplicas,
				PodsTotal:   kStatefulSet.Status.Replicas,
				Status:      status,
			})
	}

	kReplicaSets, _ := client.AppsV1().ReplicaSets(namespace).List(metav1.ListOptions{})
	var replicaSets []ReplicaSet
	for _, kReplicaSet := range kReplicaSets.Items {
		status := "Failed"
		if kReplicaSet.Status.Replicas == kReplicaSet.Status.ReadyReplicas {
			status = "Running"
		}
		replicaSets = append(replicaSets,
			ReplicaSet{
				Name:        kReplicaSet.Name,
				PodsRunning: kReplicaSet.Status.ReadyReplicas,
				PodsTotal:   kReplicaSet.Status.Replicas,
				Status:      status,
			})
	}

	c.JSON(http.StatusOK, Summary{
		Deployments:  deployments,
		Pods:         pods,
		StatefulSets: statefulSets,
		ReplicaSets:  replicaSets,
	})
}
