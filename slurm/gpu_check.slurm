#!/bin/bash
#SBATCH --job-name=gpu_check
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1
#SBATCH --output=logs/gpu_check_%j.out
#SBATCH --error=logs/gpu_check_%j.err
#SBATCH --time=00:02:00
#SBATCH --mem=2G
#SBATCH --cpus-per-task=1

echo "Node:        $(hostname)"
echo "Job ID:      $SLURM_JOB_ID"
echo "GPUs given:  ${CUDA_VISIBLE_DEVICES:-none}"
echo

nvidia-smi --query-gpu=name,memory.total,memory.used --format=csv
