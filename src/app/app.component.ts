import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface PolicyData {
  policyNumber: number;
  isValid: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title: string = 'Kin OCR';
  selectedFile: File | null = null;
  parsedData: PolicyData[] | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  onFileSelected(event: Event): void {
    this.errorMessage = null;
    const target = event.target as HTMLInputElement;
    if (!target.files) {
      this.errorMessage = 'No file selected';
      return;
    }
    const file = target.files[0];
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    if (!file) {
      this.errorMessage = 'No file selected';
      return;
    }

    if (file.type !== 'text/csv') {
      this.errorMessage = 'Please upload a CSV file';
      return;
    }

    if (file.size > maxFileSize) {
      this.errorMessage = 'File size exceeds the limit of 2MB';
      return;
    }

    this.successMessage = null;
    this.selectedFile = file;
    this.readFile();
  }

  readFile(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          this.parseCSV(e.target.result);
        } else {
          this.errorMessage = 'Failed to read file';
        }
      };
      reader.readAsText(this.selectedFile);
    }
  }

  isValidPolicyNumber(policyNumber: number): boolean {
    const policyString = String(policyNumber).padStart(9, '0');

    // Check if the policy number has exactly 9 digits
    if (policyString.length !== 9) {
      return false;
    }

    // Calculate the checksum
    let checksum = 0;
    for (let i = 0; i < 9; i++) {
      checksum += parseInt(policyString[i]) * (9 - i);
    }

    // Check if the checksum is divisible by 11
    return checksum % 11 === 0;
  }

  parseCSV(fileContent: string): void {
    // Assuming all files contain only policy numbers separated by commas
    this.parsedData = fileContent.split(',').map((item: string) => {
      const policyNumber = Number(item);
      return { policyNumber, isValid: this.isValidPolicyNumber(policyNumber) };
    });
  }

  async submitData(): Promise<void> {
    if (!this.parsedData || !this.parsedData.length) {
      this.errorMessage = 'No data to submit';
      return;
    }
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          body: JSON.stringify([this.parsedData]),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      );

      const json = await response.json();
      this.successMessage = json.id;
    } catch (error) {
      this.errorMessage = 'Failed to submit data';
    }
  }
}
