import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: adapter });

async function main() {
  await prisma.alert.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.service.deleteMany();
  await prisma.prometheusConfig.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("123456", 10);

  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password,
      name: "Administrador"
    }
  });

  const prometheusConfig = await prisma.prometheusConfig.create({
    data: {
      name: "Cluster do prometheus",
      url: "http://localhost:9090",
      userId: user.id,
    }
  });

  const serviceApi = await prisma.service.create({
    data: {
      name: "API Gateway",
      description: "Gateway principal da plataforma",
      prometheusConfigId: prometheusConfig.id,
    }
  });

  const servicePayments = await prisma.service.create({
    data: {
      name: "Payments Service",
      description: "Serviço responsável por pagamentos",
      prometheusConfigId: prometheusConfig.id,
    }
  });

  const apiRequestRateMetric = await prisma.metric.create({
    data: {
      name: "request_rate",
      promQL: 'sum(rate(http_requests_total[5m]))',
      zScoreThreshold: 3.0,
      checkInterval: 60,
      serviceId: serviceApi.id
    }
  });

  const apiLatencyMetric = await prisma.metric.create({
    data: {
      name: "latency_p95",
      promQL: 'histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))',
      zScoreThreshold: 2.5,
      checkInterval: 30,
      serviceId: serviceApi.id
    }
  });

  const paymentFailuresMetric = await prisma.metric.create({
    data: {
      name: "payment_failed_count",
      promQL: 'sum(rate(payment_failures_total[5m]))',
      zScoreThreshold: 2.0,
      checkInterval: 60,
      serviceId: servicePayments.id
    }
  });

  await prisma.alert.create({
    data: {
      metricId: apiRequestRateMetric.id,
      severity: "HIGH",
      value: 520,
      zScoreValue: 4.1
    }
  });

  await prisma.alert.create({
    data: {
      metricId: paymentFailuresMetric.id,
      severity: "CRITICAL",
      value: 12,
      zScoreValue: 5.7
    }
  });

  const stats = {
    users: await prisma.user.count(),
    configs: await prisma.prometheusConfig.count(),
    services: await prisma.service.count(),
    metrics: await prisma.metric.count(),
    alerts: await prisma.alert.count(),
  };

  console.table(stats);
}

main()
  .catch((err) => {
    console.error("Erro no seed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
