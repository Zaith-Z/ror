package rorresources

import (
	"cmp"
	"slices"

	"github.com/NorskHelsenett/ror/pkg/rorresources/rortypes"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

const (
	FilterTypeString FilterType = "string"
	FilterTypeInt    FilterType = "int"
	FilterTypeBool   FilterType = "bool"
)

type ResourceQueryFilter struct {
	Field    string     `json:"field,omitempty"`
	Value    string     `json:"value,omitempty"`
	Type     FilterType `json:"type,omitempty"`
	Operator string     `json:"operator,omitempty"`
}

type ResourceQueryOrder struct {
	Field      string `json:"field,omitempty"`
	Descending bool   `json:"descending,omitempty"`
	Index      int    `json:"index,omitempty"`
}

type ResourceQuery struct {
	VersionKind         schema.GroupVersionKind              `json:"versionkind,omitempty"`         // memory
	Uids                []string                             `json:"uids,omitempty"`                // memory
	OwnerRefs           []rortypes.RorResourceOwnerReference `json:"ownerrefs,omitempty"`           // memory
	Fields              []string                             `json:"fields,omitempty"`              // post or db
	Order               []ResourceQueryOrder                 `json:"order,omitempty"`               // post or db
	Filters             []ResourceQueryFilter                `json:"filters,omitempty"`             // db
	Offset              int                                  `json:"offset,omitempty"`              // post or db
	Limit               int                                  `json:"limit,omitempty"`               // post or db
	AdditionalResources []schema.GroupVersionKind            `json:"additionalresources,omitempty"` // memory or db
}

func NewResourceQuery() *ResourceQuery {
	return &ResourceQuery{
		Fields:              make([]string, 0),
		Order:               make([]ResourceQueryOrder, 0),
		Filters:             make([]ResourceQueryFilter, 0),
		AdditionalResources: make([]schema.GroupVersionKind, 0),
	}
}

func (rq *ResourceQuery) WithUID(uid string) *ResourceQuery {
	if rq.Uids == nil {
		rq.Uids = make([]string, 0)
	}
	rq.Uids = append(rq.Uids, uid)
	return rq
}

func (rq ResourceQuery) GetOrderSorted() []ResourceQueryOrder {
	rqo := rq.Order
	slices.SortFunc(rqo, func(a, b ResourceQueryOrder) int {
		return cmp.Compare(a.Index, b.Index)
	})

	return rqo
}