import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClusterService } from '../../services';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-cluster-compliancescore-page',
  templateUrl: './cluster-compliancescore-page.component.html',
  styleUrl: './cluster-compliancescore-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClusterComplianceScoreComponent implements OnInit {
  @Input() cluster: any;
  @Output() refreshRequested = new EventEmitter<void>();
  edit = false;
  data = [1, 2, 3, 4, 1, 2, 1];
  backgroundColors = ['#006400', '#D48282'];
  lightbackgroundColors = ['#90DDFA', '#D48282'];
  chartData = {
    labels: ['GOOD', 'BAD'],
    datasets: [
      {
        label: 'Sales',
        data: [50, 50],
        backgroundColor: this.backgroundColors,
        borderColor: this.lightbackgroundColors,
        borderWidth: 1,
      },
    ],
  };
  chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: false,
    responsive: false,
  };
  tags: string[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private clusterService: ClusterService,
  ) {}

  ngOnInit(): void {
    this.tags = this.clusterService.fillTags(this.cluster.metadata?.serviceTags || this.cluster.metadata?.project?.projectMetadata?.serviceTags);
  }

  toggleEdit() {
    this.edit = !this.edit;
  }

  onUpdateOk(event: boolean): void {
    if (event) {
      this.toggleEdit();
      this.refreshRequested.emit();
    } else {
      console.log('Update failed');
    }
  }
}
