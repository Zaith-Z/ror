import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ResourcesService } from '../core/services/resources.service';
import { VirtualmachinesListComponent } from './components/virtualmachines-list/virtualmachines-list.component';

@Component({
  selector: 'app-virtualmachines',
  standalone: true,
  imports: [CommonModule, TranslateModule, VirtualmachinesListComponent],
  templateUrl: './virtualmachines.component.html',
  styleUrl: './virtualmachines.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualmachinesComponent implements OnInit, OnDestroy {
  aclFetchError: any;
  showExportChoises: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resourcesService: ResourcesService,
  ) {}

  ngOnInit() {
    return;
  }

  ngOnDestroy(): void {
    return;
  }
}
