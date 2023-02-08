import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, Observable, tap } from 'rxjs';
import { Category, CategoryWithChildren } from 'src/app/services/category/category';
import { CategoryQuery } from 'src/app/services/category/category.query';
import { CategoryService } from 'src/app/services/category/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { CategoryStore } from 'src/app/services/category/category.store';
import { resetStores } from '@datorama/akita';

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  id: string | undefined,
  idsForFilter: string[];
}

@UntilDestroy()
@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuItemsComponent implements OnInit {
  categories$!: Observable<CategoryWithChildren[]>;
  activeId$ = this.categoryQuery.selectActiveId().pipe(map(id => id || 'all'));

  private _transformer = (node: CategoryWithChildren, level: number): FlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id: node.id,
      idsForFilter: node.idsForFilter
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode) => node.expandable;

  constructor(
    private categoryService: CategoryService,
    private categoryQuery: CategoryQuery,
    private categoryStore: CategoryStore,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const queryActiveId = this.route.snapshot.queryParams['active'] as string;

    if (!queryActiveId) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          active: 'all'
        }
      });
    }

    this.categoryStore.setActive(queryActiveId || 'all');
    this.categoryService.getAll().pipe(untilDestroyed(this)).subscribe();
    this.categoryQuery.selectAll().pipe(
      untilDestroyed(this),
      filter(categories => categories.length > 0),
      map(categories => this.buildTreeNodes(categories).sort((a, b) => a.name.localeCompare(b.name))),
    ).subscribe(data => {
      this.dataSource.data = data;
      this.treeControl.expandAll();
    })
  }

  selectFilter(node: FlatNode) {
    this.categoryStore.setActive(node.id!);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        active: node.id,
        filter: node.idsForFilter
      }
    });
  }

  refresh() {
    resetStores();
    this.categoryStore.setActive(this.route.snapshot.queryParams['active']);
  }

  getParent(rootNode: CategoryWithChildren, root: Category): CategoryWithChildren | null {
    let rootId = root.parentCategoryId;
    let rootNodeId = rootNode.id ? rootNode.id : null;

    if (rootNodeId == rootId) return rootNode;

    for (var i = 0; i < (rootNode.children?.length || 0); i++) {
        var child = rootNode.children![i];

        if (child.id === rootId) return child;

        if (child.children?.length || 0 > 0) {
          var childResult = this.getParent(child, root);
          if (childResult != null) return childResult;
        }
    }

    return null;
  };

  buildTreeNodes(arr: Category[]): CategoryWithChildren[] {
    const root: CategoryWithChildren = {
      name: 'root',
      children: [{
        name: 'All Products',
        children: [],
        idsForFilter: [],
        id: 'all'
      }],
      id: '',
      parentCategoryId: '',
      idsForFilter: []
    };

    for (var i = 0; i < arr.length; i++) {
        var elem = arr[i];
        var parent = this.getParent(root, elem);

        parent?.children?.push(this.mapToTreeNode(elem));
        parent?.idsForFilter?.push(elem?.id);
    }

    return root.children || [];
  };

  mapToTreeNode(node: Category): CategoryWithChildren {
    return {
      name: node.name,
      id: node.id,
      parentCategoryId: node.parentCategoryId,
      idsForFilter: [],
      children: [],
    }
  }
}


