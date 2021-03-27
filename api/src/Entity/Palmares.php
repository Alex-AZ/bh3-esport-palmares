<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity()
 */
class Palmares
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="bigint")
     * @Assert\NotBlank(message="Ce champ doit contenir une valeur.")
     * @Assert\Length(
     *      min = 11,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères."
     * )
     */
    private $date;

    /**
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank(message="Ce champ doit contenir une valeur.")
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Length(
     *      min = 2,
     *      max = 50,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     */
    private $event;

    /**
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank(message="Ce champ doit contenir une valeur.")
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     * @Assert\Length(
     *      min = 2,
     *      max = 50,
     *      minMessage = "Ce champ doit contenir au moins {{ limit }} caractères.",
     *      maxMessage = "Ce champ ne peut pas contenir plus de {{ limit }} caractères."
     * )
     */
    private $game;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank(message="Ce champ doit contenir une valeur.")
     * @Assert\Type(type="integer", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     */
    private $ranking;

    /**
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank(message="Ce champ doit contenir une valeur.")
     * @Assert\Type(type="string", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     */
    private $country;

    /**
     * @ORM\Column(type="boolean")
     * @Assert\NotNull(message="Ce champ doit contenir une valeur.")
     * @Assert\Type(type="bool", message="La valeur {{ value }} n'est pas de type {{ type }}.")
     */
    private $visibleOnHomepage;

    public function __construct()
    {
        $this->visibleOnHomepage = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEvent(): ?string
    {
        return $this->event;
    }

    public function setEvent(string $event): self
    {
        $this->event = $event;

        return $this;
    }

    public function getGame(): ?string
    {
        return $this->game;
    }

    public function setGame(string $game): self
    {
        $this->game = $game;

        return $this;
    }

    public function getRanking(): ?int
    {
        return $this->ranking;
    }

    public function setRanking(int $ranking): self
    {
        $this->ranking = $ranking;

        return $this;
    }

    public function getDate(): ?int
    {
        return $this->date;
    }

    public function setDate(?int $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): self
    {
        $this->country = $country;

        return $this;
    }

    public function getVisibleOnHomepage(): ?bool
    {
        return $this->visibleOnHomepage;
    }

    public function setVisibleOnHomepage(bool $visibleOnHomepage): self
    {
        $this->visibleOnHomepage = $visibleOnHomepage;

        return $this;
    }
}
