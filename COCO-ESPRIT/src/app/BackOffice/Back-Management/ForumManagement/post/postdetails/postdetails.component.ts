import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { CommentPost } from 'src/app/BackOffice/Back-Core/Models/Forum/CommentPost';
import { Post } from 'src/app/BackOffice/Back-Core/Models/Forum/Post';
import { CommentService } from 'src/app/BackOffice/Back-Core/Services/ForumS/comment.service';
import { PostService } from 'src/app/BackOffice/Back-Core/Services/ForumS/post.service';
import { ReactService } from 'src/app/BackOffice/Back-Core/Services/ForumS/react.service';

@Component({
  selector: 'app-postdetails',
  templateUrl: './postdetails.component.html',
  styleUrls: ['./postdetails.component.css']
})
export class PostdetailsComponent implements OnInit {
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

     ) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = +params['idPost']; // Get the postId parameter from the route
      this.getPostDetails();

       
    });
  }

  getPostDetails(): void {
    this.postService.getPost(this.postId).subscribe(post => {
      this.post = post;
      // Fetch reactions for each post and count occurrences
      this.reactService.getReactsForPost(this.postId).subscribe(reactions => {
        const counts = { LIKE: 0, DISLIKE: 0, LOVE: 0, ANGRY: 0 };
        reactions.forEach(reaction => {
          counts[reaction.typeReact]++;
        });
        this.reactionCounts[this.postId] = counts;
      });
      // Obtenir le nombre de commentaires pour chaque publication
      this.commentService.getCommentsForPost(post.idPost).subscribe(comments => {
        this.commentCounts[post.idPost] = of(comments.length);
      });
    });
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
      } else {
          this.currentPostIdWithVisibleComments = null;
          this.commentCounts[postId] = of(0);
      }
  });
}

hasReplies(commentId: number): Observable<boolean> {
  return this.commentService.getReplies(commentId).pipe(
      map(comments => !!comments && comments.length > 0)
  );
}


// Méthode pour basculer l'état d'affichage des réponses pour un commentaire donné
showReplies(commentId: number): void {
  this.hasReplies(commentId).subscribe(hasReplies =>{
    if(hasReplies){
this.currentCommentIdWithVisibleComments = commentId;
this.commentReplies[commentId] = this.commentService.getReplies(commentId);
this.commentReplayCounts[commentId] = this.commentService.getReplies(commentId).pipe(
  map(comments => comments.length)
);
    }else{
      this.currentCommentIdWithVisibleComments = null;
      this.commentReplayCounts[commentId] = of(0);
    }
  })
}





}
