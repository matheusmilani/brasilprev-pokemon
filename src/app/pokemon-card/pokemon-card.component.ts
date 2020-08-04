import { Component, OnInit } from '@angular/core';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.sass']
})
export class PokemonCardComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.params.id;
  }

  private id: any;
  public card: any = {};
  public loaded = false;

  ngOnInit() {

    PokemonTCG.Card.find(this.id)
    .then(card => {
      this.card = card
      this.loaded = true
    })

  }

}
