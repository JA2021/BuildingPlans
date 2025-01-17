import { BPCommentsService } from './../../service/BPComments/bpcomments.service';
import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface CommentList {
  CommentID: number;
  Comment: string;
  DateCreated: string;
  createdBy: any;
  ApplicationID: number;
  CommentStatus: string;
  SubDepartmentForCommentID: number;
  SubDepartmentName?: string;
  isClarifyCommentID?: number;
  isApplicantReplay?: string;
  UserName: string;
  FunctionalArea?: string;
  SecondReply?: string;
  CanReplyUserID?: string;
  CreatedById?: string;
  HasReply?: boolean;
  ViewReply?: boolean;
}
@Component({
  selector: 'app-comments-modal',
  templateUrl: './comments-modal.component.html',
  styleUrls: ['./comments-modal.component.css']
})
export class CommentsModalComponent implements OnInit {
  displayedColumns: string[] = ['select', 'comment', 'date', 'actions'];
  dataSourceComments: MatTableDataSource<CommentList>;
  searchText: string = '';
  selectedComment: any = {};
  selectedComments: CommentList[] = [];
  @Input() ApplicationID: number;

  @ViewChild(MatTable) table!: MatTable<any>;
  @Output() commentsSelected = new EventEmitter<CommentList[]>();
  editCommentModal: any;

  constructor(
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private commentService: BPCommentsService
  ) {
    this.dataSourceComments = new MatTableDataSource<CommentList>();
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getAllCommentsForApplication(this.ApplicationID).subscribe(
      (response: any) => {
        if (response.responseCode === 1 && response.dateSet) {
          const comments = response.dateSet.map((item: any) => ({
            CommentID: item.commentID,
            Comment: item.comment,
            DateCreated: item.dateCreated,
            CommentStatus: item.commentStatus,
            SubDepartmentName: item.subDepartmentName,
            UserName: item.userName,
            // Add other properties as needed
          } as CommentList));

          this.dataSourceComments.data = comments;
        }
      },
      error => {
        console.error('Error loading comments:', error);
      }
    );
  }

  filterComments() {
    this.dataSourceComments.filter = this.searchText.trim().toLowerCase();
  }

  toggleCommentSelection(comment: CommentList) {
    const index = this.selectedComments.findIndex(c => c.CommentID === comment.CommentID);
    if (index > -1) {
      this.selectedComments.splice(index, 1);
    } else {
      this.selectedComments.push({...comment}); // Create a copy
    }
  }

  isSelected(comment: CommentList): boolean {
    return this.selectedComments.some(c => c.CommentID === comment.CommentID);
  }

  openEditComment(comment: CommentList, editModal: any) {
    this.selectedComment = { ...comment }; // Create a copy for editing
    this.editCommentModal = this.modalService.open(editModal, {
      centered: true,
      size: 'lg'
    });
  }

  saveEditedComment() {
    const index = this.dataSourceComments.data.findIndex(comment => comment.CommentID === this.selectedComment.CommentID);
    if (index !== -1) {
      this.dataSourceComments.data[index] = this.selectedComment;
      this.dataSourceComments._updateChangeSubscription();
    }

    // Close only the edit modal using its reference
    this.editCommentModal.close();
  }

  confirmSelection() {
    // First emit the selected comments
    this.commentsSelected.emit(this.selectedComments);
    // Then close the modal
    this.modal.close(this.selectedComments);  // Changed from modalService.dismissAll()
  }
}
