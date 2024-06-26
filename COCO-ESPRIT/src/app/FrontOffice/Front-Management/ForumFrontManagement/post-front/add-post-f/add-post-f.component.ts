import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from 'src/app/BackOffice/Back-Core/Models/Forum/Post';
import { PhotosService } from 'src/app/BackOffice/Back-Core/Services/ForumS/photos.service';
import { PostService } from 'src/app/BackOffice/Back-Core/Services/ForumS/post.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-post-f',
  templateUrl: './add-post-f.component.html',
  styleUrls: ['./add-post-f.component.css']
})
export class AddPostFComponent {
  myForm!: FormGroup;
  posts: Post = new Post(); 
  imgUrl: string | ArrayBuffer = 'assets/upload.png';
  file: File | null = null;
  @Output() postAdded: EventEmitter<void> = new EventEmitter<void>();
  //idUser: number =2;


  constructor(
    private f: FormBuilder,
    private s: PostService,
    private photoService :PhotosService,
    private router: Router,
    private _dialogRef: MatDialogRef<AddPostFComponent>,
    private http: HttpClient
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

/*onSubmit() {
  let p = new Post();
p.postTitle=this.postTitle.value;
p.body=this.body.value;
p.createdAt = new Date(); // Set current system date
p.image = this.file; // Assign the image file to the 'image' attribute
//p.idUser=this.idUser;
const title = this.myForm.get('postTitle')?.value;
if (this.file) {
  this.savePhoto(this.file, p);
} else {
  this.addPost(p);
}

}*/
onSubmit() {
  if (this.extractedText && this.checkForBadWords(this.extractedText)) {
    alert('The extracted text contains bad words. Please remove them and try again.');
  } else {
    let p = new Post();
    p.postTitle = this.postTitle.value;
    p.body = this.body.value;
    p.createdAt = new Date(); // Set current system date
    p.image = this.file; // Assign the image file to the 'image' attribute

    if (this.file) {
      this.savePhoto(this.file, p);
    } else {
      this.addPost(p);
    }

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
        this._dialogRef.close(true);
        // Optionally, navigate to the post list or perform any other action
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
          this.extractTextFromImage();//to extract data from pic

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


extractTextFromImage(): void {
  const formData = new FormData();
  formData.append('image', this.file);

  // Update the URL to point to your Flask server
  this.http.post<any>('http://localhost:5000/upload', formData).subscribe({
    next: (data) => {
      if (data.detected_text) {
        this.extractedText = data.detected_text;
        console.log('Bad word extracted:', this.extractedText);

      }
    },
    error: (error) => {
      console.error('Error extracting text from image:', error);
    }
  });
}


extractedText: string = '';
badWords: string[] = [
  "Fuck", "Shit", "Asshole", "Bitch", "Bastard", "Cunt", "Dick", "Pussy",
  "Motherfucker", "Cock", "Twat", "Wanker", "Slut", "Whore", "Arsehole",
  "Douchebag", "Faggot", "Nigger", "Prick", "Dumbass"
];

checkForBadWords(text: string): boolean {
  return this.badWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
}


}
