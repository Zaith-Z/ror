import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OwnerType } from '../../../core/models/resources/ownerType';
import { FilterMatchMode } from 'primeng/api';
import { Observable, tap, catchError } from 'rxjs';
import { ResourceType } from '../../../core/models/resources/resourceType';
import { ConfigService } from '../../../core/services/config.service';
import { ResourcesService } from '../../../core/services/resources.service';
import { ResourceFilter } from '../../../resources/models/resourceFilter';
import { ColumnFactoryService } from '../../../resources/services/column-factory.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { SidebarModule } from 'primeng/sidebar';
import { ErrorComponent } from '../../../shared/components/error/error.component';
import { ResourceQuery, ResourceSet } from '../../../core/models/resources-v2';

@Component({
  selector: 'app-virtualmachines-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, SharedModule, ErrorComponent, TableModule, MultiSelectModule, FormsModule, SidebarModule],
  providers: [ColumnFactoryService],
  templateUrl: './virtualmachines-list.component.html',
  styleUrl: './virtualmachines-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualmachinesListComponent implements OnInit {
  @Input() clusterId: string = undefined;

  resourcesFetchError: any;
  resources$: Observable<ResourceSet> | undefined;
  selectedResource: any;

  owners: OwnerType[];
  resourceTypes: ResourceType[];

  selectedClusterId: string;
  filter: ResourceFilter = {
    scope: undefined,
    subject: undefined,
    kind: undefined,
    apiVersion: undefined,
    clusterId: undefined,
  };
  rowsPerPage = this.configService.config.rowsPerPage;
  rows = this.configService.config.rows;
  matchModeOptions: any[] = [
    {
      label: 'Contains',
      value: FilterMatchMode.CONTAINS,
    },
    {
      label: 'Equals',
      value: FilterMatchMode.EQUALS,
    },
  ];
  columnDefinitions: any[] = [];
  selectedColumns: any[] = [];

  sidebarVisible = false;

  query: ResourceQuery = {
    versionkind: {
      Kind: 'VirtualMachine',
      Version: 'kubevirt.io/v1alpha3',
      Group: 'kubevirt.io',
    },
  };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private resourcesService: ResourcesService,
    private columnFactoryService: ColumnFactoryService,
    private configService: ConfigService,
  ) {}

  ngOnInit(): void {
    const queries = this.activeRoute.snapshot.queryParams;
    this.filter.scope = queries['scope'];
    this.filter.subject = queries['subject'];
    this.filter.kind = queries['kind'];
    this.filter.apiVersion = queries['apiVersion'];

    this.fetchResources();
    this.changeDetector.detectChanges();
  }

  fetchResources(): void {
    this.selectedResource = undefined;
    this.resourcesFetchError = undefined;
    if (!this.filter) {
      this.resources$ = undefined;
      return;
    }
    this.resources$ = this.resourcesService.getResources(this.query).pipe(
      tap({
        next: (_) => {
          this.columnDefinitions = this.columnFactoryService.getColumnDefinitions(this.filter?.apiVersion, this.filter?.kind);
          this.selectedColumns = this.columnDefinitions;
          this.changeDetector.detectChanges();
        },
        error: (error) => {
          this.resourcesFetchError = error;
          this.changeDetector.detectChanges();
        },
      }),
      catchError((error) => {
        this.resourcesFetchError = error;
        this.changeDetector.detectChanges();
        throw error;
      }),
    );
  }

  extractData(data: any, field: string) {
    if (!data || !field) {
      return;
    }
    return field.includes('.') ? field.split('.').reduce((acc: any, obj: any) => acc[obj], data) : data[field];
  }

  export(): any {
    const exportObjects: any[] = [];
    return exportObjects;
  }

  filterChanged(event: ResourceFilter): void {
    this.filter = event;
    this.fetchResources();
    this.updateRoute();
    this.changeDetector.detectChanges();
  }

  getGlobalSearchFields(): string[] {
    return this.columnDefinitions.map((x) => x.field);
  }

  showDetails(resource: any): void {
    this.selectedResource = resource;
    this.sidebarVisible = true;
    this.changeDetector.detectChanges();
  }

  private updateRoute(): void {
    const queryParams: Params = {
      scope: this.filter?.scope,
      subject: this.filter?.subject,
      kind: this.filter?.kind,
      apiVersion: this.filter?.apiVersion,
      clusterId: this.filter?.clusterId,
    };
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: this.filter,
      queryParamsHandling: 'merge',
    });
  }
}
