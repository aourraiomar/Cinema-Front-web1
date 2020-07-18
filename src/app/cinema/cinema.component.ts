import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CinemaService} from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public villes; public cinemas; public salles;
  public currentVille;
  public currentCinema;
  public currentProjection;
  public selectedTickets=[];
  constructor(public cinemaService:CinemaService) { }

  ngOnInit(){
    this.cinemaService.getVilles()
      .subscribe(data=>
      {this.villes=data;
      },err=>{
      console.log(err);
      });
  }

  onGetCinema(v) {
    this.currentVille=v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data=>
      {this.cinemas=data;
      },err=>{
        console.log(err);
      });
  }

  onGetSalle(c) {
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
      .subscribe(data=>
      {this.salles=data;
      this.salles._embedded.salles.forEach(salle=>{
        this.cinemaService.getProjections(salle)
          .subscribe(data=>
          {salle.projections=data;
          },err=>{
            console.log(err);
          });
      })
      },err=>{
        console.log(err);
      });
  }

  onGetTicketsPlace(p) {
    this.currentProjection=p;
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data=>
      {this.currentProjection.tickets=data;
      this.selectedTickets=[];
      },err=>{
        console.log(err);
      })
  }

  onSelectTicket(t) {
  if(!t.selected) {
    t.selected = true;
    this.selectedTickets.push(t);
  }
  else{
    t.selected=false;
    this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
  }
  }

  getTicketClass(t) {
    let str="btn ticket ";
    if(t.reserve==true){
      str+="btn-danger";
    }else if(t.selected){
      str+="btn-warning";
    }else{
      str+="btn-success";
    }
  return str;
  }

  onPayTicket(dataForm) {
  let tickets=[];
  this.selectedTickets.forEach(t=>{
    tickets.push(t.id);
  });
  dataForm.tickets=tickets;
  console.log(dataForm);
  this.cinemaService.payerTickets(dataForm)
    .subscribe(data=> {
      alert("Tickets Réserve avec succes")
      this.onGetTicketsPlace(this.currentProjection);
    },err=>{
      console.log(err);
    });
  }
}
