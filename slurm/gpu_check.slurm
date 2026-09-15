#!/bin/bash
#SBATCH --job-name=gpu_check
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1
#SBATCH --output=logs/gpu_check_%j.out
#SBATCH --error=logs/gpu_check_%j.err
#SBATCH --time=00:02:00
#SBATCH --mem=2G
#SBATCH --cpus-per-task=1

# Bonus exercise on the GPUs page: ask Slurm for one GPU and report what you got.
#
# Two directives do the work here that the earlier scripts didn't need:
#     --partition=gpu    the GPU nodes are a separate partition
#     --gres=gpu:1       "generic resource": one GPU. Without it you land on a
#                        GPU node with no GPU allocated to you, and nvidia-smi
#                        shows nothing.
#
# The GPU nodes have their own reservation, class_gpu -- not the class_cpu used by
# every other job today -- so pass it on the command line. It is deliberately not
# baked in here, so the script still works unchanged after the reservation is gone.
#
# Run from the repo root:
#     mkdir -p logs
#     sbatch --reservation=class_gpu slurm/gpu_check.slurm

echo "Node:        $(hostname)"
echo "Job ID:      $SLURM_JOB_ID"
echo "GPUs given:  ${CUDA_VISIBLE_DEVICES:-none}"
echo

# What did we actually get? Model, total VRAM, and how much is in use.
nvidia-smi --query-gpu=name,memory.total,memory.used --format=csv

echo
nvidia-smi
