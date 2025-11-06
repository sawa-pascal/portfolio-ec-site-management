import { Routes } from '@angular/router';
import { Page404Component } from './page404/page404.component';
import { SigninComponent } from './signin/signin.component';

// カテゴリー
import { CategoriesListComponent } from './categories/categories-list/categories-list.component';
import { CategoriesCreatorComponent } from './categories/categories-creator/categories-creator.component';
import { CategoriesDetailComponent } from './categories/categories-detail/categories-detail.component';
import { CategoriesEditorComponent } from './categories/categories-editor/categories-editor.component';

// 商品
import { ItemsListComponent } from './items/items-list/items-list.component';
import { ItemsCreatorComponent } from './items/items-creator/items-creator.component';
import { ItemsDetailComponent } from './items/items-detail/items-detail.component';
import { ItemsEditorComponent } from './items/items-editor/items-editor.component';

// ユーザー
import { UsersListComponent } from './users/users-list/users-list.component';
import { UsersCreatorComponent } from './users/users-creator/users-creator.component';
import { UsersDetailComponent } from './users/users-detail/users-detail.component';
import { UsersEditorComponent } from './users/users-editor/users-editor.component';

export const routes: Routes = [
  { path: '', component: SigninComponent, pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },

  // カテゴリー
  { path: 'categories-list', component: CategoriesListComponent },
  { path: 'categories-creator', component: CategoriesCreatorComponent },
  { path: 'categories-detail/:id', component: CategoriesDetailComponent },
  { path: 'categories-editor/:id', component: CategoriesEditorComponent },

  // 商品
  { path: 'items-list', component: ItemsListComponent },
  { path: 'items-creator', component: ItemsCreatorComponent },
  { path: 'items-detail/:id', component: ItemsDetailComponent },
  { path: 'items-editor/:id', component: ItemsEditorComponent },

  // ユーザー
  { path: 'users-list', component: UsersListComponent },
  { path: 'users-creator', component: UsersCreatorComponent },
  { path: 'users-detail/:id', component: UsersDetailComponent },
  { path: 'users-editor/:id', component: UsersEditorComponent },

  { path: '**', component: Page404Component },
];
