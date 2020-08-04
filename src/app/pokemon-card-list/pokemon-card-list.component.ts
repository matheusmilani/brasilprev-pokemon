import { Component, OnInit } from '@angular/core';
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-card-list',
  templateUrl: './pokemon-card-list.component.html',
  styleUrls: ['./pokemon-card-list.component.sass']
})
export class PokemonCardListComponent implements OnInit {

  constructor(private router: Router) { }

  public dropdownTypes = [];
  public dropdownSubTypes = [];
  public dropdownSuperTypes = [];

  public selectedName = ''
  public selectedTypes = []
  public selectedSubTypes = []
  public selectedSuperTypes = []

  public dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'label',
    selectAllText: 'Selecionar todos',
    unSelectAllText: 'Remover seleção',
    allowSearchFilter: true
  }

  public cards:any[] = []
  public types:any[] = []
  public subTypes:any[] = []
  public superTypes:any[] = []
  public loaded = false

  goToCard(id: any) {
    this.router.navigate(['/card/', id]);
  }

  onItemSelect(item: any, filter) {
    if(filter == 'type') {
      this.selectedTypes.push(item)
    } else if (filter == 'subType') {
      this.selectedSubTypes.push(item)
    } else {
      this.selectedSuperTypes.push(item)
    }
    this.filter()
  }

  onItemDeSelect(item: any, filter) {
    if(filter == 'type') {
      this.selectedTypes = this.selectedTypes.filter(type => type.id != item.id)
    } else if (filter == 'subType') {
      this.selectedSubTypes = this.selectedSubTypes.filter(subType => subType.id != item.id)
    } else {
      this.selectedSuperTypes = this.selectedSuperTypes.filter(superType => superType.id != item.id)
    }
    this.filter()
  }

  onSelectAll(items: any, filter) {
    if(filter == 'type') {
      this.selectedTypes = items
    } else if (filter == 'subType') {
      this.selectedSubTypes = items
    } else {
      this.selectedSuperTypes = items
    }
    this.filter()
  }

  onDeSelectAll(items: any, filter) {
    if(filter == 'type') {
      this.selectedTypes = []
    } else if (filter == 'subType') {
      this.selectedSubTypes = []
    } else {
      this.selectedSuperTypes = []
    }
    this.filter()
  }

  searchByName(e: any) {
    this.cards = []
    this.loaded = false
    this.selectedName = e.target.value
    this.filter()
  }

  filter() {
    this.cards = []
    this.loaded = false

    if (this.selectedName != '') {
      PokemonTCG.Card.where([{name: 'name', value: this.selectedName}])
      .then(cards => {
        this.cards = cards
        this.loaded = true

        if (this.selectedTypes.length != 0) {
          this.cards = this.cards.filter(card => this.selectedTypes.map(type => type.label).includes(card.type))
        }

        if (this.selectedSubTypes.length != 0) {
          this.cards = this.cards.filter(card => this.selectedSubTypes.map(subtype => subtype.label).includes(card.subtype))
        }

        if (this.selectedSuperTypes.length != 0) {
          this.cards = this.cards.filter(card => this.selectedSuperTypes.map(supertype => supertype.label).includes(card.supertype))
        }
      })
    } else if (this.selectedTypes.length != 0) {
      for(let type of this.selectedTypes) {
        PokemonTCG.Card.where([{name: 'types', value: type.label}])
        .then(cards => {
          this.cards = this.cards.concat(cards)

          if (this.selectedSubTypes.length != 0) {
            this.cards = this.cards.filter(card => this.selectedSubTypes.map(subtype => subtype.label).includes(card.subtype))
          }

          if (this.selectedSuperTypes.length != 0) {
            this.cards = this.cards.filter(card => this.selectedSuperTypes.map(supertype => supertype.label).includes(card.supertype))
          }

          this.loaded = true
        })
      }
      return
    } else if (this.selectedSubTypes.length != 0){
      for(let type of this.selectedSubTypes) {
        PokemonTCG.Card.where([{name: 'subtype', value: type.label}])
        .then(cards => {
          this.cards = this.cards.concat(cards)

          if (this.selectedSuperTypes.length != 0) {
            this.cards = this.cards.filter(card => this.selectedSuperTypes.map(supertype => supertype.label).includes(card.supertype))
          }

          this.loaded = true
        })
      }
      return
    } else if (this.selectedSuperTypes.length != 0){
      for(let type of this.selectedSuperTypes) {
        PokemonTCG.Card.where([{name: 'supertype', value: type.label}])
        .then(cards => {
          this.cards = this.cards.concat(cards)
          this.loaded = true
        })
      }
      return
    } else {
      PokemonTCG.Card.all()
      .then(cards => {
        this.cards = cards
        this.loaded = true
      })
      .catch(error => {
        this.cards = []
      });
    }
  }

  ngOnInit() {
    PokemonTCG.Card.all()
    .then(cards => {
      this.cards = cards
      this.loaded = true
    })
    .catch(error => {
      this.cards = []
    });

    PokemonTCG.Meta.allTypes()
    .then(types => {
      this.dropdownTypes = types.map(type => ({id: type, label: type}))
    })

    PokemonTCG.Meta.allSubtypes()
    .then(subTypes => {
      this.dropdownSubTypes = subTypes.map(subType => ({id: subType, label: subType}))
    })

    PokemonTCG.Meta.allSupertypes()
    .then(superTypes => {
      this.dropdownSuperTypes = superTypes.map(superType => ({id: superType, label: superType}))
    })


  }

}
