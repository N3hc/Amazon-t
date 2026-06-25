import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';

  @Component({
    selector: 'app-statistics',
    standalone: true,
    imports: [],
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.css'
  })
export class StatisticsComponent implements AfterViewInit { // Cambiar a AfterViewInit
  @ViewChild('salesChart') salesChartRef!: ElementRef;
  chart: any;

  // Datos mockeados
  salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    currentYearSales: [6500, 5900, 8000, 8100, 5600, 5500, 4000, 8700, 9200, 10500, 14300, 16800],
    previousYearSales: 85000
  };

  totalSales = this.salesData.currentYearSales.reduce((a, b) => a + b, 0);
  salesChange = ((this.totalSales - this.salesData.previousYearSales) / this.salesData.previousYearSales * 100).toFixed(1);
  isDarkMode = false;

  // Cambiar a ngAfterViewInit
  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    const ctx = this.salesChartRef.nativeElement.getContext('2d');
    
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.salesData.labels,
        datasets: [{
          label: 'Monthly Sales',
          data: this.salesData.currentYearSales,
          borderColor: this.isDarkMode ? '#7C3AED' : '#2563EB',
          backgroundColor: this.isDarkMode ? 'rgba(124, 58, 237, 0.1)' : 'rgba(37, 99, 235, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: this.isDarkMode ? '#7C3AED' : '#2563EB'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: this.isDarkMode ? '#fff' : '#000'
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: this.isDarkMode ? '#374151' : '#E5E7EB'
            },
            ticks: {
              color: this.isDarkMode ? '#9CA3AF' : '#6B7280'
            }
          },
          y: {
            beginAtZero: true, // Añadir esto
            grid: {
              color: this.isDarkMode ? '#374151' : '#E5E7EB'
            },
            ticks: {
              color: this.isDarkMode ? '#9CA3AF' : '#6B7280'
            }
          }
        }
      }
    });
  }

    // Método para actualizar el tema
    updateChartTheme(isDark: boolean) {
      this.isDarkMode = isDark;
      this.createChart();
    }

    // Datos mockeados para las cards
    stats = {
      totalSales: this.totalSales.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      averageOrder: (this.totalSales / 1240).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      totalOrders: '1,240',
      topProduct: 'Wireless Headphones'
    }
  }