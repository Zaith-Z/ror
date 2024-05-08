package rortypes

// K8s PolicyReport struct generated by kyverno
type ResourcePolicyReport struct {
	CommonResource `json:",inline"`
	Results        []ResourcePolicyReportResults `json:"results"`
	Summary        ResourcePolicyReportSummary   `json:"summary"`
	LastReported   string                        `json:"lastReported,omitempty"`
}

type ResourcePolicyReportResults struct {
	Policy     string                                 `json:"policy"`
	Message    string                                 `json:"message"`
	Category   string                                 `json:"category"`
	Properties map[string]string                      `json:"properties"`
	Severity   string                                 `json:"severity"`
	Result     string                                 `json:"result"`
	Resources  []ResourcePolicyReportResultsResources `json:"resources"`
}

type ResourcePolicyReportResultsResources struct {
	Uid        string `json:"uid"`
	ApiVersion string `json:"apiVersion"`
	Kind       string `json:"kind"`
	Name       string `json:"name"`
}
type ResourcePolicyReportSummary struct {
	Error int `json:"error"`
	Fail  int `json:"fail"`
	Pass  int `json:"pass"`
	Skip  int `json:"skip"`
	Warn  int `json:"warn"`
}
