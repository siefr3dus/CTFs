import { IsString, IsEnum } from 'nestjs-swagger-dto';

export const deployment = ['prod', 'dev'] as const;
export type Deployment = (typeof deployment)[number];

export class ClusterDto {
  @IsString({
    description: 'Project Name',
    example: 'Backend',
  })
  name: string;

  @IsString({
    description: 'Project Version',
    example: '1.0.0',
  })
  version: string;

  @IsString({
    description: 'Desc',
    example: '~~~ project backend.',
  })
  description: string;

  @IsEnum({
    enum: { deployment } as any,
    description: 'deploy mode',
    example: deployment[0],
  })
  mode: Deployment;

  @IsString({
    description: 'Cluster Name',
    example: '',
  })
  hostname: string;

  @IsString({
    description: 'author',
    example: 'asdf@gmail.com',
  })
  author: string;
}
