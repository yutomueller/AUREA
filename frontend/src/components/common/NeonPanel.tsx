import { PropsWithChildren } from 'react';

export function NeonPanel({ children }: PropsWithChildren) {
  return <div className="panel">{children}</div>;
}
