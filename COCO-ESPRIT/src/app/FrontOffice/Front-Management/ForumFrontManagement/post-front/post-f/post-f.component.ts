import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { CommentPost } from 'src/app/BackOffice/Back-Core/Models/Forum/CommentPost';
import { Post } from 'src/app/BackOffice/Back-Core/Models/Forum/Post';
import { CommentService } from 'src/app/BackOffice/Back-Core/Services/ForumS/comment.service';
import { PostService } from 'src/app/BackOffice/Back-Core/Services/ForumS/post.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPostFComponent } from '../add-post-f/add-post-f.component';
import { ListcommentfComponent } from '../listcommentf/listcommentf.component';
import { ReactService } from 'src/app/BackOffice/Back-Core/Services/ForumS/react.service';
import { TypeReact } from 'src/app/BackOffice/Back-Core/Models/Forum/TypeReact';

@Component({
  selector: 'app-post-f',
  templateUrl: './post-f.component.html',
  styleUrls: ['./post-f.component.css']
})
export class PostFComponent implements OnInit {
  posts: Observable<Post[]>;

  postId: number;
  post: Post;
  commentList: Observable<CommentPost[]>;
  commentReplies: { [commentId: number]: Observable<CommentPost[]> } = {};
      // retrive comment to post
    currentPostIdWithVisibleComments: number | null = null;
    commentCounts: { [postId: number]: Observable<number> } = {};
    //replay comment
    currentCommentIdWithVisibleComments: number | null = null;
    commentReplayCounts: { [commentId: number]: Observable<number> } = {};

// New properties to store reaction counts
reactionCounts: { [postId: number]: { LIKE: number; DISLIKE: number; LOVE: number; ANGRY: number; } } = {};

  constructor(
    private route: ActivatedRoute, 
    private postService: PostService,
    private commentService:CommentService,
    private reactService:ReactService,
    private _dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.reloadData();
 
}
handleRating(postId: number, rating: number) {
  this.postService.getPost(postId).subscribe({
    next: (postToUpdate) => {
      if (postToUpdate) {
        const newRating = postToUpdate.nb_etoil + rating;
        
        this.postService.updatePostRating(postId, newRating).subscribe({
          next: () => {
            console.log(postToUpdate.nb_etoil);
            console.log(rating);
          }
        });
      } 
    }
  });
}




reloadData() {
  // Récupérer la liste des publications
  this.postService.getPostList().subscribe(posts => {
    // Trier les publications dans l'ordre décroissant en fonction de leur date de création
    posts.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    this.pageSize = Math.ceil(posts.length / this.postsPerPage);
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    this.posts = of(posts.slice(startIndex, startIndex + this.postsPerPage));
  
    // Réinitialiser les compteurs de commentaires
    this.commentCounts = {};

    // Fetch reactions for each post and count occurrences
    posts.forEach(post => {
      this.reactService.getReactsForPost(post.idPost).subscribe(reactions => {
        const counts = { LIKE: 0, DISLIKE: 0, LOVE: 0, ANGRY: 0 };
        reactions.forEach(reaction => {
          counts[reaction.typeReact]++;
        });
        this.reactionCounts[post.idPost] = counts;

        // Obtenir le nombre de commentaires pour chaque publication
        this.commentService.getCommentsForPost(post.idPost).subscribe(comments => {
          this.commentCounts[post.idPost] = of(comments.length);
        });
      });
    });
  });
}

  

//pagination front
pageSize: number; 
postsPerPage: number = 3;
currentPage: number = 1;
pageChange: EventEmitter<number> = new EventEmitter<number>();


goToPage(pageNumber: number) {
  this.currentPage = pageNumber;
  this.reloadData();
}

//add post
openAddPostForm() {
  const dialogRef = this._dialog.open(AddPostFComponent);
}



get pageSizeArray(): number[] {
  return Array.from({ length: this.pageSize }, (_, i) => i + 1);
}

// Function to check if there are comments for a post
hasComments(postId: number): Observable<boolean> {
  return this.commentService.getCommentsForPost(postId).pipe(
      map(comments => !!comments && comments.length > 0)
  );
}




showComments(postId: number): void {
  this.hasComments(postId).subscribe(hasComments => {
    if (hasComments) {
      this.currentPostIdWithVisibleComments = postId;
      this.commentList = this.commentService.getCommentsForPost(postId);
      this.commentCounts[postId] = this.commentService.getCommentsForPost(postId).pipe(
        map(comments => comments.length)
      );

      // Ouvrir le dialogue en passant l'ID du post
      const dialogRef = this._dialog.open(ListcommentfComponent, {
        data: { postId: postId }
      });
    } else {
      this.currentPostIdWithVisibleComments = null;
      this.commentCounts[postId] = of(0);
    }
  });
}




}
