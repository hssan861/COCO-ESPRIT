import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from 'src/app/BackOffice/Back-Core/Models/Forum/Post';
import { PhotosService } from 'src/app/BackOffice/Back-Core/Services/ForumS/photos.service';
import { PostService } from 'src/app/BackOffice/Back-Core/Services/ForumS/post.service';

@Component({
  selector: 'app-post-facebook',
  templateUrl: './post-facebook.component.html',
  styleUrls: ['./post-facebook.component.css']
})
export class PostFacebookComponent {
  myForm!: FormGroup;
  posts: Post = new Post(); 
  imgUrl: string | ArrayBuffer = 'assets/upload.png';
  file: File | null = null;


  constructor(
    private f: FormBuilder,
    private s: PostService,
    private photoService :PhotosService,
    private router: Router,
    ) { 
    
  }

  ngOnInit(): void {
    this.myForm = this.f.group({
      postTitle: ['', [Validators.required, Validators.minLength(7)]],
      body: ['', [Validators.required, Validators.minLength(15)]]
    });
   
  }
  
  get postTitle(){
    return this.myForm.get('postTitle')
  }
  get body(){
    return this.myForm.get('body')
  }

onSubmit() {
  let p = new Post();
p.postTitle=this.postTitle.value;
p.body=this.body.value;
p.createdAt = new Date(); // Set current system date
p.image = this.file; // Assign the image file to the 'image' attribute
const title = this.myForm.get('postTitle')?.value;
if (this.file) {
  this.savePhoto(this.file, p);
} else {
  this.addPost(p);
}

}
addPost(post: Post): void {
  console.log(post);
  this.s.AddWithoutBadWord(post).subscribe({
    next: (response: string) => {
      if (response === 'This post contain bad word') {
        alert('The post contains bad words. Please remove them and try again.');
      } else if (response === 'add successfuly') {
        // Reset the form and close the dialog if the post is added successfully
        this.myForm.reset(); 
        alert("add successfuly");
      //  this._dialogRef.close(true);
        // Optionally, navigate to the post list or perform any other action
        this.postAdded.emit();
        this.gotoList();

      }
    },
    error: (error: any) => {
      console.error('Error adding post:', error);
      // Handle error gracefully, if needed
    }
  });
}



gotoList() {
this.router.navigate(['/ListPostFront']);
}

onFileInput(files: FileList | null): void {
  if (files) {
    this.file = files.item(0);
    if (this.file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.file);
      fileReader.onload = (event) => {
        if (fileReader.result) {
          this.imgUrl = fileReader.result;
        }
      };
    }
  }
}
savePhoto(file: File, post: Post): void {
  const title = this.myForm.get('postTitle')?.value;
  if (title) {
    this.photoService.uploadImage(file, title)
      .subscribe({
        next: (res: string) => { 
          post.image = res;
          this.addPost(post);
          console.log('Image uploaded successfully:', res);
        },
        error: (error: any) => {
          console.error('Error uploading image:', error);
        }
      });
  }
}
@Output() postAdded: EventEmitter<void> = new EventEmitter<void>();


}
