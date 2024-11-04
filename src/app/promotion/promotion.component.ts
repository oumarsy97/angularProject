import { Component } from '@angular/core';
import {NgForOf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage
  ],
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent {
  promotions = [
    { title: "Bonus de transfert", description: "Recevez 10% de bonus sur chaque transfert vers un compte Wave.", image: "assets/bonus.png" },
    { title: "Réduction des frais", description: "Profitez de 50% de réduction sur vos frais de transaction ce mois-ci.", image: "assets/reduction.png" }
  ];
}
