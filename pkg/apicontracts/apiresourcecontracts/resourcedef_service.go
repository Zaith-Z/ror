package apiresourcecontracts

import (
	"k8s.io/apimachinery/pkg/util/intstr"
)

// ResourceService K8s PolicyReport struct generated by kyverno
type ResourceService struct {
	ApiVersion string              `json:"apiVersion"`
	Kind       string              `json:"kind"`
	Metadata   ResourceMetadata    `json:"metadata"`
	Spec       ResourceServiceSpec `json:"spec"`
}

type ResourceServiceSpec struct {
	Type                  string                 `json:"type"`
	Selector              map[string]string      `json:"selector"`
	Ports                 []ResourceServicePorts `json:"ports"`
	ClusterIP             string                 `json:"clusterIP"`
	ClusterIPs            []string               `json:"clusterIPs"`
	ExternalIPs           []string               `json:"externalIPs,omitempty"`
	ExternalName          string                 `json:"externalName,omitempty"`
	IpFamilies            []string               `json:"ipFamilies"`
	IpFamilyPolicy        string                 `json:"ipFamilyPolicy"`
	InternalTrafficPolicy string                 `json:"internalTrafficPolicy"`
	ExternalTrafficPolicy string                 `json:"externalTrafficPolicy"`
}

type ResourceServicePorts struct {
	AppProtocol string             `json:"appProtocol"`
	Name        string             `json:"name"`
	Port        int                `json:"port"`
	Protocol    string             `json:"protocol"`
	TargetPort  intstr.IntOrString `json:"targetPort"`
}
