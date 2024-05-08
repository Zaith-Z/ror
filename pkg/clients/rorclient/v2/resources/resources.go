package resources

import (
	"github.com/NorskHelsenett/ror/pkg/rorresources"
)

type ResourcesInterface interface {
	Get(query rorresources.ResourceQuery) (rorresources.ResourceSet, error)
	Update(res *rorresources.ResourceSet) (*rorresources.ResourceUpdateResults, error)
	GetByUid(uid string) (rorresources.ResourceSet, error)
	UpdateByUid(uid string, res *rorresources.ResourceSet) (string, error)
	DeleteByUid(uid string) (string, error)
	ExistsByUid(uid string) (bool, error)
	GetHashes() (string, error)
}
