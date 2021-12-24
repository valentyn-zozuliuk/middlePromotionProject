import { TestBed } from '@angular/core/testing';

import { ArticlesResolver } from './articles-resolver.resolver';

describe('ArticlesResolverResolver', () => {
  let resolver: ArticlesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ArticlesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
