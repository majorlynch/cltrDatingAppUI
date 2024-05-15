import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  //members$: Observable<Member[]> | undefined;
  members: Member[] = [];
  pagination: Pagination | undefined;
  pageNumber = 1;
  pageSize = 5;
  
  
  constructor( private memberService: MembersService) {}

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    console.log(this.pageNumber, this.pageSize);
    this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
        next: response => {
          if (response.result && response.pagination) {
              this.members = response.result;
              this.pagination = response.pagination
            }
          }
        
        
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      //this.memberService.setUserParams(this.userParams);
      this.pageNumber = event.page;
      this.loadMembers();
    }
  }

}
