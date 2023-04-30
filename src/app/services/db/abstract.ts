import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  doc,
  docData,
  DocumentReference,
  Firestore,
  query,
  QueryConstraint
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

export abstract class Db<T extends { id: string }> {
  private readonly collection: CollectionReference<T>;

  constructor(protected db: Firestore, private path: string) {
    this.collection = collection(db, path) as CollectionReference<T>;
  }

  list(...queryFilters: QueryConstraint[]): Observable<T[] | null> {
    return collectionData(
      query(this.collection, ...queryFilters),
      {
        idField: 'id',
      }
    )
    .pipe(map(data => data.map(d => this.transform(d))));
  }

  get(id: string): Observable<T> {
    return docData(
      doc(this.db, `${this.path}/${id}`) as DocumentReference<T>,
      {
        idField: 'id',
      }
    )
    .pipe(map(data => this.transform(data)));
  }

  async add(item: T): Promise<DocumentReference<T>> {
    return addDoc(this.collection, item);
  }

  protected transform(dbData: any): T {
    return dbData;
  }
}
