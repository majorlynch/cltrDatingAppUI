import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  members: Member[] = [];
  baseUrl = environment.apiUrl;
  pageinatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;

  constructor(private http:HttpClient) { }

  getMembers(page?:number, itemsPerPage?: number){
    let params = new HttpParams();

    if (page && itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    //if (this.members.length > 0) {console.log('return current list');return of (this.members)};
    return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).pipe(
      map(response => {
        if(response.body) {
          this.pageinatedResult.result = response.body;          
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          this.pageinatedResult.pagination = JSON.parse(pagination);
        }
        return this.pageinatedResult;
      })
      //map(members => {
      //  this.members = members;
      //  return members;
      //})
    )
  }

  getMember(username: string){
    const member = this.members.find(x => x.userName === username);
    if (member) return of (member)
    return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member }
      })
    )
  }

}
