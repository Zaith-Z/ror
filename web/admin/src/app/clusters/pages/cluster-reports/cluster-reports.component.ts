import { Component, Input, OnInit } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ComplianceReport } from '../../../core/models/complianceReport';
import { ComplianceReportsService } from '../../../core/services/compliance-reports.service';
import { ExportService } from '../../../core/services/export.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cluster-reports',
  templateUrl: './cluster-reports.component.html',
  styleUrl: './cluster-reports.component.scss',
})
export class ClusterReportsComponent implements OnInit {
  @Input() clusterId: string;

  complianceReports$: Observable<ComplianceReport[]>;
  mainColumns: any[];
  subColumns: any[];
  showExportChoices: boolean;
  selectedTab = 0;
  selectedTabIndex: number = 0;

  constructor(
    private complianceReportService: ComplianceReportsService,
    private exportService: ExportService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.getComplianceReports();
  }

  getComplianceReports(): void {
    this.complianceReports$ = this.complianceReportService.getComplianceReports(this.clusterId).pipe(
      catchError((error) => {
        throw of(error);
      }),
    );
  }

  getValue(object: Object, key: string): void {
    const keySplit = key?.split('.', 2);
    if (keySplit?.length > 1) {
      return this?.getValue(object[keySplit[0]], keySplit[1]);
    }
    return object[key];
  }

  exportToCsv(reports: ComplianceReport[]): void {
    this.exportService.exportToCsv(this.formatExport(reports), 'compliance-reports.csv');
  }

  exportToExcel(reports: ComplianceReport[]): void {
    this.exportService.exportAsExcelFile(this.formatExport(reports), 'compliance-reports');
  }

  formatExport(reports: ComplianceReport[]): any[] {
    const formattedExport: any[] = [];
    reports?.forEach((report) => {
      const entry: any = {};
      entry.date = new Date()?.toLocaleString('no');
      entry.name = report?.metadata?.name;
      entry.title = report?.metadata?.title;
      entry.passed = report?.summary?.passcount;
      entry.failed = report?.summary?.failcount;
      formattedExport.push(entry);
    });
    return formattedExport?.length > 0 ? formattedExport : [''];
  }

  switchTab(selectedIndex: number): void {
    try {
      console.log('Tab: ', selectedIndex, this.tabs);
      const tab = this.tabs[selectedIndex];
      this.location.replaceState(`cluster/${this.clusterId}`, tab?.query);
    } catch {
      //ignoring
    }
  }
  switchView(selectedIndex: number): void {
    try {
      console.log('Tab: ', selectedIndex, this.tabs);
      this.selectedTab = selectedIndex;
    } catch {
      //ignoring
    }
  }

  getClass() {
    return {
      'bg-yellow-500': this.selectedTab === 0,
    };
  }

  private tabs: any[] = [
    {
      metadata: 'vulnerabilityReports',
      query: 'tab=vulnerabilityReports',
    },
    {
      metadata: 'complianceReports',
      query: 'tab=complianceReports',
    },
    {
      metadata: 'policyReports',
      query: 'tab=policyReports',
    },
  ];
}
